package org.supplychain.order;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import java.util.List;

@DataType()
public class OrderDetailsList {

    private final static Gson geson = new Gson();

    @Property()
    List<OrderDetails> orders;

    public List<OrderDetails> getOrders() {
        return orders;
    }

    public void setOrders(List<OrderDetails> orders) {
        this.orders = orders;
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static OrderDetailsList fromJSONString(String json) {
        OrderDetailsList asset = geson.fromJson(json, OrderDetailsList.class);
        return asset;
    }

    @Override
    public String toString() {
        return "OrderDetailsList{" + "orders=" + orders + '}';
    }
}
