package org.supplychain;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

@DataType()
public class AccessRequest {
    private final static Gson geson = new Gson();

    @Property
    private String accessRequestId;

    @Property
    private String requestingOrgName;

    @Property
    private String approvingOrgName;

    @Property
    private String approvalStatus;

    @Property
    private String publishedDate;

    @Property
    private String approvalDate;

    @Property
    private String commentFromApprovingOrg;

    @Property
    private String commentFromRequestingOrg;

    @Property
    private String orderId;

    /**
     * Id of the product through which the access was raised
     */
    @Property
    private String productHistoryOrderId;

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getApprovalDate() {
        return approvalDate;
    }

    public void setApprovalDate(String approvalDate) {
        this.approvalDate = approvalDate;
    }

    public String getCommentFromRequestingOrg() {
        return commentFromRequestingOrg;
    }

    public void setCommentFromRequestingOrg(String commentFromRequestingOrg) {
        this.commentFromRequestingOrg = commentFromRequestingOrg;
    }

    public String getRequestingOrgName() {
        return requestingOrgName;
    }

    public void setRequestingOrgName(String requestingOrgName) {
        this.requestingOrgName = requestingOrgName;
    }

    public String getApprovingOrgName() {
        return approvingOrgName;
    }

    public void setApprovingOrgName(String approvingOrgName) {
        this.approvingOrgName = approvingOrgName;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(AccessRequestState approvalStatus) {
        this.approvalStatus = approvalStatus.name();
    }

    public String getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(String publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getCommentFromApprovingOrg() {
        return commentFromApprovingOrg;
    }

    public void setCommentFromApprovingOrg(String commentFromApprovingOrg) {
        this.commentFromApprovingOrg = commentFromApprovingOrg;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getProductHistoryOrderId() {
        return productHistoryOrderId;
    }

    public void setProductHistoryOrderId(String productHistoryOrderId) {
        this.productHistoryOrderId = productHistoryOrderId;
    }

    public String getAccessRequestId() {
        return accessRequestId;
    }

    public void setAccessRequestId(String accessRequestId) {
        this.accessRequestId = accessRequestId;
    }

    @Override
    public String toString() {
        return "AccessRequest{" +
                "accessRequestId='" + accessRequestId + '\'' +
                ", requestingOrgName='" + requestingOrgName + '\'' +
                ", approvingOrgName='" + approvingOrgName + '\'' +
                ", approvalStatus='" + approvalStatus + '\'' +
                ", Date='" + publishedDate + '\'' +
                ", commentFromApprovingOrg='" + commentFromApprovingOrg + '\'' +
                ", commentFromRequestingOrg='" + commentFromRequestingOrg + '\'' +
                ", orderId='" + orderId + '\'' +
                ", productHistoryOrderId='" + productHistoryOrderId + '\'' +
                '}';
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static AccessRequest fromJSONString(String json) {
        AccessRequest asset = geson.fromJson(json, AccessRequest.class);
        return asset;
    }
}
