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
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;
import org.hyperledger.fabric.shim.ledger.QueryResultsIteratorWithMetadata;
import org.supplychain.access_request.AccessRequest;
import org.supplychain.access_request.AccessRequestList;
import org.supplychain.access_request.AccessRequestState;
import org.supplychain.order.Comment;
import org.supplychain.order.Order;
import org.supplychain.order.OrderDetailsList;
import org.supplychain.order.OrderStatus;
import org.supplychain.private_data.PrivateDataCollectionsUtil;

import java.io.IOException;
import java.math.BigInteger;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "OrderContract", info = @Info(title = "OrderDetails contract", description = "My Smart Contract", version = "0.0.1", license = @License(name = "Apache-2.0", url = ""), contact = @Contact(email = "order-details@example.com", name = "order-details", url = "http://order-details.me")))
@Default
public class OrderContract implements ContractInterface {

    private static Logger logger = Logger.getLogger(OrderContract.class.getName());

    public OrderContract() {

    }

    @Transaction()
    public void initLedger(final Context ctx) throws IOException {
        logger.info(new PrivateDataCollectionsUtil().getCollectionNameForOrg("Customer", ""));
        logger.info("Just checking 2.0");
    }

    @Transaction()
    public boolean orderDetailsExists(Context ctx, String orderId, String orgName) throws IOException {

        List<String> collectionList = new PrivateDataCollectionsUtil().getAllCollectionsContainingOrg(orgName);
        for (String collection : collectionList) {
            logger.info("Collection used: " + collection);
            byte[] privateData = ctx.getStub().getPrivateData(collection, orderId);
            if (Order.fromJSONString(new String(privateData, "UTF-8")) != null) {
                return true;
            }
        }
        return false;
    }

    @Transaction()
    public void createOrder(Context ctx) throws IOException {
        Map<String, byte[]> transientData = ctx.getStub().getTransient();
        if (transientData.size() == 0 | !transientData.containsKey("order")) {
            throw new RuntimeException("The order key was not specified in transient data. Please try again.");
        }
        Order asset = Order.fromJSONString(new String(transientData.get("order"), "UTF-8"));
        boolean exists = orderDetailsExists(ctx, asset.getOrderId(), asset.getInitiatorOrgName());
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

        String collection = new PrivateDataCollectionsUtil().getCollectionNameForOrg(asset.getInitiatorOrgName(),
                asset.getApproverOrgName());

        logger.info("Collection used: " + collection);
        ctx.getStub().putPrivateData(collection, asset.getOrderId(), asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public void updateOrderDetails(Context ctx) throws IOException {
        Map<String, byte[]> transientData = ctx.getStub().getTransient();
        if (transientData.size() == 0 | !transientData.containsKey("order")) {
            throw new RuntimeException("The order key was not specified in transient data. Please try again.");
        }
        Order updatedAsset = Order.fromJSONString(new String(transientData.get("order"), "UTF-8"));
        boolean exists = orderDetailsExists(ctx, updatedAsset.getOrderId(),
                updatedAsset.getOrderLastUpdatedByOrgName());
        if (!exists) {
            throw new RuntimeException("The asset " + updatedAsset.getOrderId() + " does not exist");
        }
        if (!checkIfOrgCanUpdateOrder(updatedAsset, updatedAsset.getOrderLastUpdatedByOrgName())) {
            throw new RuntimeException("Invalid Access");
        }
        // Set the approval org name to the org that needs to approve the updates
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
        String collection = new PrivateDataCollectionsUtil().getCollectionNameForOrg(updatedAsset.getInitiatorOrgName(),
                updatedAsset.getApproverOrgName());
        logger.info("Collection used: " + collection);
        ctx.getStub().putPrivateData(collection, updatedAsset.getOrderId(),
                updatedAsset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public Order getOrderDetails(Context ctx, String orderDetailsId, String orgName) throws IOException, RuntimeException {
        List<String> collectionList = new PrivateDataCollectionsUtil().getAllCollectionsContainingOrg(orgName);
        for (String collection : collectionList) {
            logger.info("Collection used: " + collection);
            byte[] privateData = ctx.getStub().getPrivateData(collection, orderDetailsId);
            if (Order.fromJSONString(new String(privateData, "UTF-8")) != null) {
                return Order.fromJSONString(new String(privateData, "UTF-8"));
            }
        }
        return new Order();
    }

    @Transaction()
    public void deleteOrderDetails(Context ctx, String orderDetailsId, String orgName) throws IOException {
        boolean exists = orderDetailsExists(ctx, orderDetailsId, orgName);
        if (!exists) {
            throw new RuntimeException("The asset " + orderDetailsId + " does not exist");
        }
        String collectionName = "";
        List<String> collectionList = new PrivateDataCollectionsUtil().getAllCollectionsContainingOrg(orgName);
        for (String collection : collectionList) {
            byte[] privateData = ctx.getStub().getPrivateData(collection, orderDetailsId);
            if (privateData != null)
                collectionName = collection;
        }
        logger.info("Collection used: " + collectionName);
        ctx.getStub().delPrivateData(collectionName, orderDetailsId);
    }

    @Transaction()
    public void approveOrderStatus(Context ctx) throws IOException {
        Map<String, byte[]> transientData = ctx.getStub().getTransient();
        if (transientData.size() == 0 || !transientData.containsKey("orderId") || !transientData.containsKey("orgName")
                || !transientData.containsKey("userName") || !transientData.containsKey("comment")
                || !transientData.containsKey("approvalStatus")) {
            throw new RuntimeException("The privateValue key was not specified in transient data. Please try again.");
        }
        String orderDetailsId = new String(transientData.get("orderId"), "UTF-8");
        String orderStatusUpdatedByOrgName = new String(transientData.get("orgName"), "UTF-8");
        String userName = new String(transientData.get("userName"), "UTF-8");
        String comment = new String(transientData.get("comment"), "UTF-8");
        String approvalStatus = new String(transientData.get("approvalStatus"), "UTF-8");

        Order asset = getOrderDetails(ctx, orderDetailsId, orderStatusUpdatedByOrgName);
        if (asset.getOrderId() == null) {
            throw new RuntimeException("The asset " + orderDetailsId + " does not exist");
        }
        if (!checkIfOrgCanUpdateOrder(asset, orderStatusUpdatedByOrgName)) {
            throw new RuntimeException("Invalid Access");
        }
        if (approvalStatus.equals(OrderStatus.APPROVED.name()) || approvalStatus.equals(OrderStatus.REJECTED.name())) {
            if (asset.hasInitiatorLastUpdateTheOrderDetails() && asset.isApproverOrg(orderStatusUpdatedByOrgName)) {
                asset.setApproverOrgApprovalStatus(OrderStatus.valueOf(approvalStatus));
                asset.setApprovalNeededForOrg(asset.getInitiatorOrgName());
            } else if (asset.hasApproverLastUpdateTheOrderDetails()
                    && asset.isInitiatorOrg(orderStatusUpdatedByOrgName)) {
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
            Comment commentObj = new Comment(comment, new Date().toString(), orderStatusUpdatedByOrgName, userName);
            List<Comment> comments = asset.getCommentList();
            if (comments == null) {
                comments = new ArrayList<>();
            }
            comments.add(commentObj);
            asset.setCommentList(comments);
        }
        String collection = new PrivateDataCollectionsUtil().getCollectionNameForOrg(asset.getInitiatorOrgName(),
                asset.getApproverOrgName());
        logger.info("Collection used: " + collection);
        ctx.getStub().putPrivateData(collection, orderDetailsId, asset.toJSONString().getBytes(UTF_8));
    }

    @Transaction()
    public OrderDetailsList getAllOrderForOrgName(Context ctx, String orgName) throws IOException {

        List<String> collectionList = new PrivateDataCollectionsUtil().getAllCollectionsContainingOrg(orgName);
        OrderDetailsList data = new OrderDetailsList();
        List<Order> orderDetailsList = new ArrayList<>();
        for (String collection : collectionList) {
            logger.info("Collection used: " + collection);
            QueryResultsIterator<KeyValue> queryResultIterator = ctx.getStub().getPrivateDataQueryResult(collection,
                    "{\"selector\":{\"initiatorOrgName\":\"" + orgName + "\"}}");
            for (KeyValue kv : queryResultIterator) {
                logger.info(Order.fromJSONString(new String(kv.getValue(), UTF_8)).toJSONString());
                orderDetailsList.add(Order.fromJSONString(new String(kv.getValue(), UTF_8)));
            }
        }
        data.setOrders(orderDetailsList);
        return data;
    }

    @Transaction()
    public OrderDetailsList getAllOrderThatNeedApproval(Context ctx, String orgName) throws IOException {
        List<String> collectionList = new PrivateDataCollectionsUtil().getAllCollectionsContainingOrg(orgName);
        OrderDetailsList data = new OrderDetailsList();
        List<Order> orderDetailsList = new ArrayList<>();
        for (String collection : collectionList) {
            logger.info("Collection used: " + collection);
            QueryResultsIterator<KeyValue> queryResultIterator = ctx.getStub().getPrivateDataQueryResult(collection,
                    "{\"selector\":{\"approvalNeededForOrg\":\"" + orgName + "\"}}");
            for (KeyValue kv : queryResultIterator) {
                logger.info(Order.fromJSONString(new String(kv.getValue(), UTF_8)).toJSONString());
                orderDetailsList.add(Order.fromJSONString(new String(kv.getValue(), UTF_8)));
            }
        }
        data.setOrders(orderDetailsList);
        return data;
    }

    @Transaction()
    public OrderDetailsList getAllOrderAsApproverOrg(Context ctx, String orgName) throws IOException {
        List<String> collectionList = new PrivateDataCollectionsUtil().getAllCollectionsContainingOrg(orgName);
        OrderDetailsList data = new OrderDetailsList();
        List<Order> orderDetailsList = new ArrayList<>();
        for (String collection : collectionList) {
            logger.info("Collection used: " + collection);
            QueryResultsIterator<KeyValue> queryResultIterator = ctx.getStub().getPrivateDataQueryResult(collection,
                    "{\"selector\":{\"approverOrgName\":\"" + orgName + "\"}}");
            for (KeyValue kv : queryResultIterator) {
                logger.info(Order.fromJSONString(new String(kv.getValue(), UTF_8)).toJSONString());
                orderDetailsList.add(Order.fromJSONString(new String(kv.getValue(), UTF_8)));
            }
        }
        logger.info(orderDetailsList.toString());
        data.setOrders(orderDetailsList);
        return data;
    }

    @Transaction()
    public boolean verifyOrder(Context ctx, String orderId, Order objectToVerify)
            throws NoSuchAlgorithmException, IOException {
        String collection = new PrivateDataCollectionsUtil()
                .getCollectionNameForOrg(objectToVerify.getInitiatorOrgName(), objectToVerify.getApproverOrgName());
        // Convert user provided object into hash
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashByte = digest.digest(objectToVerify.toJSONString().getBytes(UTF_8));

        String hashToVerify = new BigInteger(1, hashByte).toString(16);

        // Get hash stored on the public ledger
        byte[] pdHashBytes = ctx.getStub().getPrivateDataHash(collection, orderId);
        if (pdHashBytes.length == 0) {
            throw new RuntimeException("No private data hash with the key: " + orderId);
        }

        String actualHash = new BigInteger(1, pdHashBytes).toString(16);

        if (hashToVerify.equals(actualHash)) {
            return true;
        } else {
            return false;
        }
    }

    private boolean checkIfOrgCanUpdateOrder(Order asset, String orderDetailsUpdatedByOrgName) {
        return asset.getApproverOrgName().equals(orderDetailsUpdatedByOrgName)
                || asset.getInitiatorOrgName().equals(orderDetailsUpdatedByOrgName);
    }


    //Access Request Contracts
    @Transaction
    public String createAccessRequest(Context ctx, String accessRequestJson) {
        AccessRequest accessRequest = AccessRequest.fromJSONString(accessRequestJson);
        boolean exists = accessRequestExists(ctx, accessRequest.getRequestingOrgName(),
                accessRequest.getApprovingOrgName(), accessRequest.getOrderId());
        if (exists) {
            throw new RuntimeException("The access reuest already exists");
        }
        accessRequest.setApprovalStatus(AccessRequestState.PENDING);
        accessRequest.setApprovalDate("");
        accessRequest.setPublishedDate(new Date().toString());
        ctx.getStub().putState(accessRequest.getAccessRequestId(), accessRequest.toJSONString().getBytes(UTF_8));
        return accessRequest.getAccessRequestId();
    }

    @Transaction
    public boolean accessRequestExists(Context ctx, String requestingOrgName, String approvingOrgName, String orderId) {
        QueryResultsIterator<KeyValue> queryResultIterator = ctx.getStub()
                .getQueryResult("{\"selector\": {\"$and\": [ {\"requestingOrgName\": \"" + requestingOrgName + "\" },"
                        + "{\"approvingOrgName\": \"" + approvingOrgName + "\" }," + "{\"orderId\": \"" + orderId
                        + "\" }] } }");
        if (queryResultIterator == null || !queryResultIterator.iterator().hasNext()) {
            return false;
        } else {
            return true;
        }
    }

    @Transaction
    public String updateAccessRequestStatus(Context ctx, String accessRequestId, String status,
                                            String approvalOrgName) {
        AccessRequest accessRequest = AccessRequest
                .fromJSONString(new String(ctx.getStub().getState(accessRequestId), UTF_8));
        if (!approvalOrgName.equals(accessRequest.getApprovingOrgName())) {
            throw new RuntimeException("Invalid Org");
        }
        if (status.equals(AccessRequestState.APPROVED.name()) || status.equals(AccessRequestState.REJECTED.name())) {
            accessRequest.setApprovalStatus(status);
            accessRequest.setApprovalDate(new Date().toString());
        }
        ctx.getStub().putState(accessRequest.getAccessRequestId(), accessRequest.toJSONString().getBytes(UTF_8));
        return accessRequest.getAccessRequestId();
    }

    @Transaction()
    public boolean accessRequestExistsById(Context ctx, String accessHistoryId) {
        byte[] buffer = ctx.getStub().getState(accessHistoryId);
        return (buffer != null && buffer.length > 0);
    }

    @Transaction
    public void deleteAccessRequest(Context ctx, String accessHistoryId) {
        boolean exists = accessRequestExistsById(ctx, accessHistoryId);
        if (!exists) {
            throw new RuntimeException("The asset " + accessHistoryId + " does not exist");
        }
        ctx.getStub().delState(accessHistoryId);
    }

    @Transaction()
    public AccessRequestList getAccessRequestListForRequestingOrg(Context ctx, String requestingOrgName, int pageSize,
                                                                  String bookmark) {
        QueryResultsIteratorWithMetadata<KeyValue> queryResultIterator = ctx.getStub().getQueryResultWithPagination(
                "{\"selector\":{\"requestingOrgName\":\"" + requestingOrgName + "\"}}", pageSize, bookmark);

        AccessRequestList data = new AccessRequestList();
        List<AccessRequest> accessRequestList = new ArrayList<>();
        for (KeyValue kv : queryResultIterator) {
            accessRequestList.add(AccessRequest.fromJSONString(new String(kv.getValue(), UTF_8)));
        }
        data.setAccessRequests(accessRequestList);
        return data;
    }

    @Transaction()
    public AccessRequestList getAccessRequestListForApprovingOrg(Context ctx, String approvingOrgName, int pageSize,
                                                                 String bookmark) {
        QueryResultsIteratorWithMetadata<KeyValue> queryResultIterator = ctx.getStub().getQueryResultWithPagination(
                "{\"selector\":{\"approvingOrgName\":\"" + approvingOrgName + "\"}}", pageSize, bookmark);
        AccessRequestList data = new AccessRequestList();
        List<AccessRequest> accessRequestList = new ArrayList<>();
        for (KeyValue kv : queryResultIterator) {
            accessRequestList.add(AccessRequest.fromJSONString(new String(kv.getValue(), UTF_8)));
        }
        data.setAccessRequests(accessRequestList);
        return data;
    }

}
