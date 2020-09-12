/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.example;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import java.util.List;

@DataType()
public class OrderDetails {

    private final static Gson geson = new Gson();

    @Property()
    private String orderId;

    @Property()
    private String initiatorOrgName;

    @Property
    private String approverOrgName;

    @Property()
    private String initiatorOrgApprovalStatus;

    @Property
    private String approverOrgApprovalStatus;

    @Property
    private String payload;

    @Property
    private String publishedDate;

    @Property
    private String lastUpdated;

    @Property
    private List<Comment> commentList;

    @Property
    private String orderLastUpdatedByOrgName;

    public OrderDetails() {
    }
    public String getInitiatorOrgApprovalStatus() {
        return initiatorOrgApprovalStatus;
    }

    public void setInitiatorOrgApprovalStatus(OrderStatus initiatorOrgApprovalStatus) {
        this.initiatorOrgApprovalStatus = initiatorOrgApprovalStatus.name();
    }

    public String getApproverOrgApprovalStatus() {
        return approverOrgApprovalStatus;
    }

    public void setApproverOrgApprovalStatus(OrderStatus approverOrgApprovalStatus) {
        this.approverOrgApprovalStatus = approverOrgApprovalStatus.name();
    }
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getInitiatorOrgName() {
        return initiatorOrgName;
    }

    public void setInitiatorOrgName(String initiatorOrgName) {
        this.initiatorOrgName = initiatorOrgName;
    }

    public String getApproverOrgName() {
        return approverOrgName;
    }

    public void setApproverOrgName(String approverOrgName) {
        this.approverOrgName = approverOrgName;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public String getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(String publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(String lastUpdated) {
        this.lastUpdated = lastUpdated;
    }

    public String toJSONString() {
        return geson.toJson(this);
    }


    public List<Comment> getCommentList() {
        return commentList;
    }

    public void setCommentList(List<Comment> commentList) {
        this.commentList = commentList;
    }

    public String getOrderLastUpdatedByOrgName() {
        return orderLastUpdatedByOrgName;
    }

    public void setOrderLastUpdatedByOrgName(String orderLastUpdatedByOrgName) {
        this.orderLastUpdatedByOrgName = orderLastUpdatedByOrgName;
    }

    public static OrderDetails fromJSONString(String json) {
        OrderDetails asset = geson.fromJson(json, OrderDetails.class);
        return asset;
    }

    public boolean hasInitiatorLastUpdateTheOrderDetails(){
        return orderLastUpdatedByOrgName.equals(initiatorOrgName);
    }

    public boolean hasApproverLastUpdateTheOrderDetails(){
        return orderLastUpdatedByOrgName.equals(approverOrgName);
    }

    public boolean isInitiatorOrg(String orgName){
        return orgName.equals(initiatorOrgName);
    }

    public boolean isApproverOrg(String orgName){
        return orgName.equals(approverOrgName);
    }

    @Override
    public String toString() {
        return "OrderDetails{" +
                "orderId='" + orderId + '\'' +
                ", initiatorOrgName='" + initiatorOrgName + '\'' +
                ", approverOrgName='" + approverOrgName + '\'' +
                ", initiatorOrgApprovalStatus='" + initiatorOrgApprovalStatus + '\'' +
                ", approverOrgApprovalStatus='" + approverOrgApprovalStatus + '\'' +
                ", payload='" + payload + '\'' +
                ", publishedDate='" + publishedDate + '\'' +
                ", lastUpdated='" + lastUpdated + '\'' +
                ", commentList=" + commentList +
                ", orderLastUpdatedByOrgName='" + orderLastUpdatedByOrgName + '\'' +
                '}';
    }
}
