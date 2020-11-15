/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.supplychain;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

@DataType()
public class OrderDetails {

    private final static Gson geson = new Gson();

    @Property()
    private String orderId;

    @Property()
    private String orgName;

    @Property()
    private String orderDate;

    @Property()
    private String orderType;   

    public OrderDetails(String orderId, String orgName, String orderDate, String orderType) {
        this.orderId = orderId;
        this.orgName = orgName;
        this.orderDate = orderDate;
        this.orderType = orderType;
    }

    public String getOrderId() {
        return orderId;
    }

    public String getOrgName() {
        return orgName;
    }

    public String getOrderDate() {
        return orderDate;
    }

    public String getOrderType() {
        return orderType;
    }

    @Override
    public String toString() {
        return "{" +
            " orderid='" + getOrderId() + "\'" +
            ", orgName='" + getOrgName() + "\'" +
            ", orderDate='" + getOrderDate() + "\'" +
            ", orderType='" + getOrderType() + "\'" +
            "}";
    }


    public String toJSONString() {
        return geson.toJson(this);
    }

    public static OrderDetails fromJSONString(String json) {
        OrderDetails asset = geson.fromJson(json, OrderDetails.class);
        return asset;
    }

    @Override
    public boolean equals(Object obj) {
        if (this.orderId.equals(((OrderDetails) obj).orderId)) {
            return true;
        } else {
            return false;
        }
    }
}
