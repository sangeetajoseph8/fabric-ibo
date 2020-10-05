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

import java.util.*;
import java.util.logging.Logger;

import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "ProductHistoryContract", info = @Info(title = "ProductHistory contract", description = "My Smart Contract", version = "0.0.2", license = @License(name = "Apache-2.0", url = ""), contact = @Contact(email = "product-history@example.com", name = "product-history", url = "http://product-history.me")))
@Default
public class ProductHistoryContract implements ContractInterface {

    private static Logger logger = Logger.getLogger(ProductHistoryContract.class.getName());

    public ProductHistoryContract() {

    }

    @Transaction()
    public void initLedger(final Context ctx) {

        logger.info("Just checking 2.0");
        List<ProductHistoryConnection> list = ProductHistoryConnectionInti.getData();
        for (ProductHistoryConnection item : list) {
            ctx.getStub().putState(item.getConnectionId(), item.toJSONString().getBytes(UTF_8));
        }
    }

    @Transaction()
    public boolean productHistoryConnectionExists(Context ctx, String productHistoryConnectionId) {
        byte[] buffer = ctx.getStub().getState(productHistoryConnectionId);
        return (buffer != null && buffer.length > 0);
    }

    @Transaction()
    public String createProductHistoryConnection(Context ctx, String productHistoryConnectionId, String orderJson1,
            String orderJson2) {
        boolean exists = productHistoryConnectionExists(ctx, productHistoryConnectionId);
        if (exists) {
            throw new RuntimeException("The asset " + productHistoryConnectionId + " already exists");
        }
        ProductHistory asset1 = ProductHistory.fromJSONString(orderJson1);
        ProductHistory asset2 = ProductHistory.fromJSONString(orderJson2);
        ProductHistoryConnection connection = new ProductHistoryConnection(productHistoryConnectionId, asset1, asset2);

        ctx.getStub().putState(productHistoryConnectionId, connection.toJSONString().getBytes(UTF_8));
        return productHistoryConnectionId;
    }

    @Transaction()
    public ProductHistory readProductHistoryConnection(Context ctx, String productHistoryId) {
        boolean exists = productHistoryConnectionExists(ctx, productHistoryId);
        if (!exists) {
            throw new RuntimeException("The asset " + productHistoryId + " does not exist");
        }

        ProductHistory newAsset = ProductHistory
                .fromJSONString(new String(ctx.getStub().getState(productHistoryId), UTF_8));
        return newAsset;
    }

    @Transaction()
    public void deleteProductHistory(Context ctx, String productHistoryId) {
        boolean exists = productHistoryConnectionExists(ctx, productHistoryId);
        if (!exists) {
            throw new RuntimeException("The asset " + productHistoryId + " does not exist");
        }
        ctx.getStub().delState(productHistoryId);
    }

    @Transaction()
    public ProductHistoryList getProductHistory(Context ctx, String orderId) {
        ProductHistoryList data = new ProductHistoryList();
        List<ProductHistoryConnection> productHistoryConnectionList = new ArrayList<>();

        List<ProductHistory> productHistoryList = new ArrayList<>();

        List<ProductHistoryConnection> firstProductHistoryConnectionList = getProductHistoryConnections(ctx, orderId);

        if (firstProductHistoryConnectionList.isEmpty())
            return data;

        processSubListOfConnections(ctx, firstProductHistoryConnectionList, productHistoryConnectionList,
                productHistoryList);
        productHistoryList.sort(Comparator.comparing(ProductHistory::getOrderDate));
        data.setProductHistories(productHistoryList);
        return data;
    }

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

    private void processSubListOfConnections(Context ctx, List<ProductHistoryConnection> subConnectionList,
            List<ProductHistoryConnection> productHistoryConnectionList, List<ProductHistory> productHistoryList) {
        for (ProductHistoryConnection conn : subConnectionList) {
            if (productHistoryConnectionList.contains(conn))
                continue;
            productHistoryConnectionList.add(conn);
            ProductHistory productHistory1 = conn.getProductHistory1();
            ProductHistory productHistory2 = conn.getProductHistory2();

            if (!productHistoryList.contains(productHistory1)) {
                productHistoryList.add(productHistory1);
                List<ProductHistoryConnection> list = getProductHistoryConnections(ctx, productHistory1.getOrderId());
                processSubListOfConnections(ctx, list, productHistoryConnectionList, productHistoryList);
            }
            if (!productHistoryList.contains(productHistory2)) {
                productHistoryList.add(productHistory2);
                List<ProductHistoryConnection> list = getProductHistoryConnections(ctx, productHistory2.getOrderId());
                processSubListOfConnections(ctx, list, productHistoryConnectionList, productHistoryList);
            }
        }
    }

    private List<ProductHistoryConnection> getProductHistoryConnections(Context ctx, String orderId) {
        QueryResultsIterator<KeyValue> queryResultIterator = ctx.getStub()
                .getQueryResult("{\"selector\": {\"$or\": [ {\"productHistory1.orderId\": \"" + orderId + "\" },"
                        + "{\"productHistory2.orderId\": \"" + orderId + "\" }] } }");

        List<ProductHistoryConnection> productHistoryConnection = new ArrayList<>();
        for (KeyValue kv : queryResultIterator) {
            productHistoryConnection.add(ProductHistoryConnection.fromJSONString(new String(kv.getValue(), UTF_8)));
        }
        return productHistoryConnection;
    }

}
