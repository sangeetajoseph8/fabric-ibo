package org.supplychain;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Transaction;
import org.hyperledger.fabric.shim.ledger.KeyValue;
import org.hyperledger.fabric.shim.ledger.QueryResultsIterator;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import static java.nio.charset.StandardCharsets.UTF_8;

public class ProductHistoryContract implements ContractInterface {
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
        OrderDetails asset1 = OrderDetails.fromJSONString(orderJson1);
        OrderDetails asset2 = OrderDetails.fromJSONString(orderJson2);
        ProductHistoryConnection connection = new ProductHistoryConnection(productHistoryConnectionId, asset1, asset2);

        ctx.getStub().putState(productHistoryConnectionId, connection.toJSONString().getBytes(UTF_8));
        return productHistoryConnectionId;
    }

    @Transaction()
    public OrderDetails readProductHistoryConnection(Context ctx, String productHistoryId) {
        boolean exists = productHistoryConnectionExists(ctx, productHistoryId);
        if (!exists) {
            throw new RuntimeException("The asset " + productHistoryId + " does not exist");
        }

        OrderDetails newAsset = OrderDetails
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

        List<OrderDetails> orderDetailsList = new ArrayList<>();

        List<ProductHistoryConnection> firstProductHistoryConnectionList = getProductHistoryConnections(ctx, orderId);

        if (firstProductHistoryConnectionList.isEmpty())
            return data;

        processSubListOfConnections(ctx, firstProductHistoryConnectionList, productHistoryConnectionList,
                orderDetailsList);
        orderDetailsList.sort(Comparator.comparing(OrderDetails::getOrderDate));
        data.setProductHistory(orderDetailsList);
        return data;
    }

    private void processSubListOfConnections(Context ctx, List<ProductHistoryConnection> subConnectionList,
                                             List<ProductHistoryConnection> productHistoryConnectionList, List<OrderDetails> orderDetailsList) {
        for (ProductHistoryConnection conn : subConnectionList) {
            if (productHistoryConnectionList.contains(conn))
                continue;
            productHistoryConnectionList.add(conn);
            OrderDetails orderDetails1 = conn.getOrderDetails1();
            OrderDetails orderDetails2 = conn.getOrderDetails2();

            if (!orderDetailsList.contains(orderDetails1)) {
                orderDetailsList.add(orderDetails1);
                List<ProductHistoryConnection> list = getProductHistoryConnections(ctx, orderDetails1.getOrderId());
                processSubListOfConnections(ctx, list, productHistoryConnectionList, orderDetailsList);
            }
            if (!orderDetailsList.contains(orderDetails2)) {
                orderDetailsList.add(orderDetails2);
                List<ProductHistoryConnection> list = getProductHistoryConnections(ctx, orderDetails2.getOrderId());
                processSubListOfConnections(ctx, list, productHistoryConnectionList, orderDetailsList);
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
