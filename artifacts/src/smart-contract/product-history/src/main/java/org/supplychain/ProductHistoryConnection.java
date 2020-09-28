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
    private ProductHistory productHistory1;

    @Property()
    private ProductHistory productHistory2;

    public ProductHistoryConnection() {

    }

    public ProductHistoryConnection(String connectionId, ProductHistory productHistory1,
            ProductHistory productHistory2) {
        this.connectionId = connectionId;
        this.productHistory1 = productHistory1;
        this.productHistory2 = productHistory2;
    }

    public String getConnectionId() {
        return this.connectionId;
    }

    public ProductHistory getProductHistory1() {
        return this.productHistory1;
    }

    public ProductHistory getProductHistory2() {
        return this.productHistory2;
    }

    public ProductHistory getProductHistoryWithOrderId(String orderId) {
        if (productHistory1.getOrderId().equals(orderId))
            return productHistory1;
        else if (productHistory2.getOrderId().equals(orderId))
            return productHistory2;
        return null;
    }

    @Override
    public String toString() {
        return "{" + " connectionId='" + getConnectionId() + "\'" + ", productHistory1='" + getProductHistory1() + "\'"
                + ", productHistory2='" + getProductHistory2() + "\'" + "}";
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