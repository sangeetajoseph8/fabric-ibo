package org.supplychain;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import java.util.List;

@DataType()
public class ProductHistoryList {
    private final static Gson geson = new Gson();

    @Property()
    List<OrderDetails> productHistory;

    public List<OrderDetails> getProductHistory() {
        return productHistory;
    }

    public void setProductHistory(List<OrderDetails> productHistory) {
        this.productHistory = productHistory;
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static ProductHistoryList fromJSONString(String json) {
        ProductHistoryList asset = geson.fromJson(json, ProductHistoryList.class);
        return asset;
    }

    @Override
    public String toString() {
        return "ProductHistoryList{" +
                "productHistories=" + productHistory +
                '}';
    }
}
