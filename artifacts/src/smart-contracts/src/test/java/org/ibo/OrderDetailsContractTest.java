/*
 * SPDX-License-Identifier: Apache License 2.0
 */

package org.ibo;
import static java.nio.charset.StandardCharsets.UTF_8;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;



public final class OrderDetailsContractTest {

    @Nested
    class AssetExists {
        @Test
        public void noProperAsset() {

            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);

            when(stub.getState("10001")).thenReturn(new byte[] {});
            boolean result = contract.orderDetailsExists(ctx,"10001");

            assertFalse(result);
        }

        @Test
        public void assetExists() {

            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);

            when(stub.getState("10001")).thenReturn(new byte[] {42});
            boolean result = contract.orderDetailsExists(ctx,"10001");

            assertTrue(result);

        }

        @Test
        public void noKey() {
            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);

            when(stub.getState("10002")).thenReturn(null);
            boolean result = contract.orderDetailsExists(ctx,"10002");

            assertFalse(result);

        }

    }

    @Nested
    class AssetCreates {

        public void newAssetCreate() {
            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);

            String json = "{\"approverOrgId\":\"approverOrgId\",\"initiatorOrgId\":\"initiatorOrgId\",\"lastUpdated\":1598045603119,\"orderId\":\"10001\",\"payload\":\"payload\",\"publishedDate\":1598045603345}";

            //contract.createOrderDetails(ctx, "10001");

            verify(stub).putState("10001", json.getBytes(UTF_8));
        }


        public void alreadyExists() {
            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);

            when(stub.getState("10002")).thenReturn(new byte[] { 42 });

            Exception thrown = assertThrows(RuntimeException.class, () -> {
                //contract.createOrderDetails(ctx, "10002");
            });

            assertEquals(thrown.getMessage(), "The asset 10002 already exists");

        }

    }

    @Test
    public void assetRead() {
        OrderDetailsContract contract = new  OrderDetailsContract();
        Context ctx = mock(Context.class);
        ChaincodeStub stub = mock(ChaincodeStub.class);
        when(ctx.getStub()).thenReturn(stub);

        OrderDetails asset = new  OrderDetails();
        asset.setPayload("Payload");

        String json = asset.toJSONString();
        when(stub.getState("10001")).thenReturn(json.getBytes(StandardCharsets.UTF_8));

        OrderDetails returnedAsset = contract.readOrderDetails(ctx, "10001");
        assertEquals(returnedAsset.getPayload(), asset.getPayload());
    }

    @Nested
    class AssetUpdates {

        public void updateExisting() {
            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);
            when(stub.getState("10001")).thenReturn(new byte[] { 42 });

            contract.updateOrderDetails(ctx, "10001", "SupplierOrg", "Manufacturer Org",
                    "", "second comment");

            String json = "{\"value\":\"updates\"}";
            verify(stub).putState("10001", json.getBytes(UTF_8));
        }

        public void updateMissing() {
            OrderDetailsContract contract = new  OrderDetailsContract();
            Context ctx = mock(Context.class);
            ChaincodeStub stub = mock(ChaincodeStub.class);
            when(ctx.getStub()).thenReturn(stub);

            when(stub.getState("10001")).thenReturn(null);
            contract.approveOrderStatus(ctx,"","","","APPROVED");
            Exception thrown = assertThrows(RuntimeException.class, () -> {
                contract.updateOrderDetails(ctx, "10001", "SupplierOrg", "Manufacturer Org",
                        "", "first comment");
            });

            assertEquals(thrown.getMessage(), "The asset 10001 does not exist");
        }

    }

    @Test
    public void assetDelete() {
        OrderDetailsContract contract = new  OrderDetailsContract();
        Context ctx = mock(Context.class);
        ChaincodeStub stub = mock(ChaincodeStub.class);
        when(ctx.getStub()).thenReturn(stub);
        when(stub.getState("10001")).thenReturn(null);

        Exception thrown = assertThrows(RuntimeException.class, () -> {
            contract.deleteOrderDetails(ctx, "10001");
        });

        assertEquals(thrown.getMessage(), "The asset 10001 does not exist");
    }

}
