package org.supplychain;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.*;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;
import org.hyperledger.fabric.shim.ledger.QueryResultsIteratorWithMetadata;
import org.supplychain.access_request.AccessRequest;
import org.supplychain.access_request.AccessRequestList;
import org.supplychain.access_request.AccessRequestState;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "AccessRequestContract", info = @Info(title = "AccessRequestContract contract", description = "My Smart Contract", version = "0.0.2", license = @License(name = "Apache-2.0", url = ""), contact = @Contact(email = "product-history@example.com", name = "product-history", url = "http://product-history.me")))
@Default
public class AccessRequestContract implements ContractInterface {
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

