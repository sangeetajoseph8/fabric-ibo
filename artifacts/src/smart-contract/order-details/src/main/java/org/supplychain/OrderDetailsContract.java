/*
 * SPDX-License-Identifier: Apache-2.0
 */
package org.supplychain;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIteratorWithMetadata;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "OrderDetailsContract", info = @Info(title = "OrderDetails contract", description = "My Smart Contract", version = "0.0.1", license = @License(name = "Apache-2.0", url = ""), contact = @Contact(email = "order-details@example.com", name = "order-details", url = "http://order-details.me")))
@Default
public class OrderDetailsContract implements ContractInterface {
    private static Logger logger = Logger.getLogger(OrderDetailsContract.class.getName());

    public OrderDetailsContract() {

    }

    @Transaction()
    public void initLedger(final Context ctx) {
        logger.info("Just checking 2.0");
    }

    @Transaction()
    public boolean orderDetailsExists(Context ctx, String orderDetailsId) {
        byte[] buffer = ctx.getStub().getState(orderDetailsId);
        return (buffer != null && buffer.length > 0);
    }

    @Transaction()
    public void createOrderDetails(Context ctx, String orderDetailsJson) {
        OrderDetails asset = OrderDetails.fromJSONString(orderDetailsJson);
        boolean exists = orderDetailsExists(ctx, asset.getOrderId());
        if (exists) {
            throw new RuntimeException("The asset " + asset.getOrderId() + " already exists");
        }
        asset.setLastUpdated(new Date().toString());
        asset.setPublishedDate(new Date().toString());
        asset.setInitiatorOrgApprovalStatus(OrderStatus.PENDING);
        if (asset.getApproverOrgName() != null && !asset.getApproverOrgName().isEmpty()) {
            asset.setApproverOrgApprovalStatus(OrderStatus.PENDING);
        }
        ctx.getStub().putState(asset.getOrderId(), asset.toJSONString().getBytes(UTF_8));

    }

    @Transaction()
    public OrderDetails getOrderDetails(Context ctx, String orderDetailsId) {
        boolean exists = orderDetailsExists(ctx, orderDetailsId);
        if (!exists) {
            return null;
        }
        return OrderDetails.fromJSONString(new String(ctx.getStub().getState(orderDetailsId), UTF_8));
    }

    @Transaction()
    public void updateOrderDetails(Context ctx, String orderDetailsJson) {
        OrderDetails updatedAsset = OrderDetails.fromJSONString(orderDetailsJson);
        checkIfOrderExist(ctx, updatedAsset.getOrderId());

        if (!checkIfOrgCanUpdateOrder(updatedAsset, updatedAsset.getOrderLastUpdatedByOrgName())) {
            throw new RuntimeException("Invalid Access");
        }
        updatedAsset.setLastUpdated(new Date().toString());

        if (updatedAsset.getOrderLastUpdatedByOrgName().equals(updatedAsset.getApproverOrgName())) {
            updatedAsset.setInitiatorOrgApprovalStatus(OrderStatus.PENDING);
        } else if (updatedAsset.getOrderLastUpdatedByOrgName().equals(updatedAsset.getInitiatorOrgName())) {
            updatedAsset.setApproverOrgApprovalStatus(OrderStatus.PENDING);
        }
        ctx.getStub().putState(updatedAsset.getOrderId(), updatedAsset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public void deleteOrderDetails(Context ctx, String orderDetailsId) {
        boolean exists = orderDetailsExists(ctx, orderDetailsId);
        if (!exists) {
            throw new RuntimeException("The asset " + orderDetailsId + " does not exist");
        }
        ctx.getStub().delState(orderDetailsId);
    }

    @Transaction()
    public void approveOrderStatus(Context ctx, String orderId, String orderStatusUpdatedByOrgName, String comment,
            String approvalStatus) {
        checkIfOrderExist(ctx, orderId);
        OrderDetails asset = OrderDetails.fromJSONString(new String(ctx.getStub().getState(orderId), UTF_8));
        if (!checkIfOrgCanUpdateOrder(asset, orderStatusUpdatedByOrgName)) {
            throw new RuntimeException("Invalid Access");
        }
        if (approvalStatus.equals(OrderStatus.APPROVED.name()) || approvalStatus.equals(OrderStatus.REJECTED.name())) {
            if (asset.hasInitiatorLastUpdateTheOrderDetails() && asset.isApproverOrg(orderStatusUpdatedByOrgName)) {
                asset.setApproverOrgApprovalStatus(OrderStatus.valueOf(approvalStatus));
            } else if (asset.hasApproverLastUpdateTheOrderDetails()
                    && asset.isInitiatorOrg(orderStatusUpdatedByOrgName)) {
                asset.setInitiatorOrgApprovalStatus(OrderStatus.valueOf(approvalStatus));
            } else {
                throw new RuntimeException("Invalid Org");
            }
        } else {
            throw new RuntimeException("Invalid approval status");
        }

        asset.setOrderLastUpdatedByOrgName(orderStatusUpdatedByOrgName);
        asset.setLastUpdated(new Date().toString());
        if (comment != null && !comment.isEmpty()) {
            List<Comment> comments = asset.getCommentList();
            comments.add(new Comment(comment, new Date().toString()));
        }

        ctx.getStub().putState(orderId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public OrderDetailsList getAllOrderForOrgName(Context ctx, String orgName, int pageSize, String bookmark) {
        QueryResultsIteratorWithMetadata<KeyValue> queryResultIterator = ctx.getStub().getQueryResultWithPagination(
                String.valueOf("{\"selector\":{\"initiatorOrgName\":\"" + orgName + "\"}}"), pageSize, bookmark);
        OrderDetailsList data = new OrderDetailsList();
        List<OrderDetails> orderDetailsList = new ArrayList<>();
        for (KeyValue kv : queryResultIterator) {
            logger.info(OrderDetails.fromJSONString(new String(kv.getValue(), UTF_8)).toJSONString());
            orderDetailsList.add(OrderDetails.fromJSONString(new String(kv.getValue(), UTF_8)));
        }
        System.out.println(orderDetailsList.toString());
        data.setOrders(orderDetailsList);
        return data;
    }

    private void checkIfOrderExist(Context ctx, String orderId) {
        boolean exists = orderDetailsExists(ctx, orderId);
        if (!exists) {
            throw new RuntimeException("The asset " + orderId + " does not exist");
        }
    }

    public boolean checkIfOrgCanUpdateOrder(OrderDetails asset, String orderDetailsUpdatedByOrgName) {
        return asset.getApproverOrgName().equals(orderDetailsUpdatedByOrgName)
                || asset.getInitiatorOrgName().equals(orderDetailsUpdatedByOrgName);
    }

}
