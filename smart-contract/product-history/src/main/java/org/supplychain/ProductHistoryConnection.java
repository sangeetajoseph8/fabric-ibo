package org.supplychain;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

@DataType()
public class ProductHistoryConnection {

    private final static Gson geson = new Gson();

    @Property()
    private String connectionId;

    @Property()
    private OrderDetails orderDetails1;

    @Property()
    private OrderDetails orderDetails2;

    public ProductHistoryConnection() {

    }

    public ProductHistoryConnection(String connectionId, OrderDetails orderDetails1,
            OrderDetails orderDetails2) {
        this.connectionId = connectionId;
        this.orderDetails1 = orderDetails1;
        this.orderDetails2 = orderDetails2;
    }

    public String getConnectionId() {
        return this.connectionId;
    }

    public OrderDetails getOrderDetails1() {
        return this.orderDetails1;
    }

    public OrderDetails getOrderDetails2() {
        return this.orderDetails2;
    }

    public OrderDetails getProductHistoryWithOrderId(String orderId) {
        if (orderDetails1.getOrderId().equals(orderId))
            return orderDetails1;
        else if (orderDetails2.getOrderId().equals(orderId))
            return orderDetails2;
        return null;
    }

    @Override
    public String toString() {
        return "{" + " connectionId='" + getConnectionId() + "\'" + ", productHistory1='" + getOrderDetails1() + "\'"
                + ", productHistory2='" + getOrderDetails2() + "\'" + "}";
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static ProductHistoryConnection fromJSONString(String json) {
        ProductHistoryConnection asset = geson.fromJson(json, ProductHistoryConnection.class);
        return asset;
    }

    @Override
    public boolean equals(Object obj) {
        if (this.connectionId.equals(((ProductHistoryConnection) obj).connectionId)) {
            return true;
        } else {
            return false;
        }
    }
}