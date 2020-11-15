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
import org.supplychain.order.Comment;
import org.supplychain.order.OrderDetails;
import org.supplychain.order.OrderDetailsList;
import org.supplychain.order.OrderStatus;

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
    public void createOrder(Context ctx, String orderDetailsJson) {
        OrderDetails asset = OrderDetails.fromJSONString(orderDetailsJson);
        boolean exists = orderDetailsExists(ctx, asset.getOrderId());
        if (exists) {
            throw new RuntimeException("The asset " + asset.getOrderId() + " already exists");
        }
        asset.setLastUpdated(new Date().toString());
        asset.setPublishedDate(new Date().toString());

        if (asset.getApproverOrgName() != null && !asset.getApproverOrgName().isEmpty()) {
            asset.setInitiatorOrgApprovalStatus(OrderStatus.PENDING);
            asset.setApproverOrgApprovalStatus(OrderStatus.PENDING);
            asset.setApprovalNeededForOrg(asset.getApproverOrgName());
        } else {
            asset.setInitiatorOrgApprovalStatus(OrderStatus.NOT_NEEDED);
        }
        ctx.getStub().putState(asset.getOrderId(), asset.toJSONString().getBytes(UTF_8));

    }

    @Transaction()
    public OrderDetails getOrderDetails(Context ctx, String orderDetailsId) {
        boolean exists = orderDetailsExists(ctx, orderDetailsId);
        if (!exists) {
            return new OrderDetails();
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
        //Set the approval org name to the org that needs to approve the updates
        if (updatedAsset.getApproverOrgName() != null && !updatedAsset.getApproverOrgName().isEmpty()) {
            if (updatedAsset.getOrderLastUpdatedByOrgName().equals(updatedAsset.getInitiatorOrgName())) {
                updatedAsset.setApprovalNeededForOrg(updatedAsset.getApproverOrgName());
                updatedAsset.setApproverOrgApprovalStatus(OrderStatus.PENDING);
            } else {
                updatedAsset.setApprovalNeededForOrg(updatedAsset.getInitiatorOrgName());
                updatedAsset.setInitiatorOrgApprovalStatus(OrderStatus.PENDING);
            }
        }
        updatedAsset.setLastUpdated(new Date().toString());
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
    public void approveOrderStatus(Context ctx, String orderId, String orderStatusUpdatedByOrgName, String userName, String comment,
                                   String approvalStatus) {
        checkIfOrderExist(ctx, orderId);
        OrderDetails asset = OrderDetails.fromJSONString(new String(ctx.getStub().getState(orderId), UTF_8));
        if (!checkIfOrgCanUpdateOrder(asset, orderStatusUpdatedByOrgName)) {
            throw new RuntimeException("Invalid Access");
        }
        if (approvalStatus.equals(OrderStatus.APPROVED.name()) || approvalStatus.equals(OrderStatus.REJECTED.name())) {
            if (asset.hasInitiatorLastUpdateTheOrderDetails() && asset.isApproverOrg(orderStatusUpdatedByOrgName)) {
                asset.setApproverOrgApprovalStatus(OrderStatus.valueOf(approvalStatus));
                asset.setApprovalNeededForOrg(asset.getInitiatorOrgName());
            } else if (asset.hasApproverLastUpdateTheOrderDetails() && asset.isInitiatorOrg(orderStatusUpdatedByOrgName)) {
                asset.setInitiatorOrgApprovalStatus(OrderStatus.valueOf(approvalStatus));
                asset.setApprovalNeededForOrg(asset.getApproverOrgName());
            } else {
                throw new RuntimeException("Invalid Org");
            }
        } else {
            throw new RuntimeException("Invalid approval status");
        }

        asset.setOrderLastUpdatedByOrgName(orderStatusUpdatedByOrgName);
        asset.setLastUpdated(new Date().toString());

        if (comment != null && !comment.isEmpty()) {
            Comment commentObj = new Comment(comment, new Date().toString(),orderStatusUpdatedByOrgName,userName);
            List<Comment> comments = asset.getCommentList();
            if(comments == null){
                comments = new ArrayList<>();
            }
            comments.add(commentObj);
            asset.setCommentList(comments);
        }

        ctx.getStub().putState(orderId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public OrderDetailsList getAllOrderForOrgName(Context ctx, String orgName) {
        QueryResultsIteratorWithMetadata<KeyValue> queryResultIterator = ctx.getStub().getQueryResultWithPagination(
                String.valueOf("{\"selector\":{\"initiatorOrgName\":\"" + orgName + "\"}}"), 10, "");
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

    @Transaction()
    public OrderDetailsList getAllOrderThatNeedApproval(Context ctx, String orgName) {
        QueryResultsIteratorWithMetadata<KeyValue> queryResultIterator = ctx.getStub().getQueryResultWithPagination(
                String.valueOf("{\"selector\":{\"approvalNeededForOrg\":\"" + orgName + "\"}}"), 10, "");
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

    @Transaction()
    public OrderDetailsList getAllOrderAsApproverOrg(Context ctx, String orgName) {
        QueryResultsIteratorWithMetadata<KeyValue> queryResultIterator = ctx.getStub().getQueryResultWithPagination(
                String.valueOf("{\"selector\":{\"approverOrgName\":\"" + orgName + "\"}}"), 10, "");
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

    private boolean checkIfOrgCanUpdateOrder(OrderDetails asset, String orderDetailsUpdatedByOrgName) {
        return asset.getApproverOrgName().equals(orderDetailsUpdatedByOrgName)
                || asset.getInitiatorOrgName().equals(orderDetailsUpdatedByOrgName);
    }

}
