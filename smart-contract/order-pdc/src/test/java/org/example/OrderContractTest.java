/*
 * SPDX-License-Identifier: Apache License 2.0

*/
package org.example;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.shim.ChaincodeStub;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.supplychain.OrderContract;
import org.supplychain.private_data.PrivateDataCollection;
import org.supplychain.private_data.PrivateDataCollectionsUtil;


public final class OrderContractTest {

    Context ctx;
    ChaincodeStub stub;
    OrderContract contract;

    String collection = "CollectionOne";

    @BeforeEach
    void beforeEach() {
        ctx = mock(Context.class);
        stub = mock(ChaincodeStub.class);
        when(ctx.getStub()).thenReturn(stub);

        contract = new OrderContract();

        byte[] someAsset = ("{\"privateValue\":\"125\"}").getBytes(StandardCharsets.UTF_8);
        when(stub.getPrivateData(collection, "001")).thenReturn(someAsset);
        when(stub.getPrivateDataHash(collection, "001")).thenReturn(("someAsset").getBytes(StandardCharsets.UTF_8));
    }

    @Nested
    class AssetExists {
        /*
        @Test
        public void noProperAsset() {
            when(stub.getPrivateData(collection, "002")).thenReturn(("").getBytes(StandardCharsets.UTF_8));
            boolean result = contract.orderExists(ctx, "002");
            assertFalse(result);
        }

        @Test
        public void assetExists() {
            boolean result = contract.orderExists(ctx, "001");
            assertTrue(result);
        }

        @Test
        public void noKey() {
            boolean result = contract.orderExists(ctx,"10002");
            assertFalse(result);
        }*/
    }

    @Nested
    class PDCTest {

        @Test
        public void pdcList() throws IOException {
            PrivateDataCollectionsUtil pdcu = new PrivateDataCollectionsUtil();
            List<PrivateDataCollection> pdcArray = pdcu.getCollectionList();
            assertEquals(pdcArray.size(), 10);
        }

        @Test
        public void pdcOrgTest() throws IOException {
            PrivateDataCollectionsUtil pdcu = new PrivateDataCollectionsUtil();
            List<String> pdcArry = pdcu.getAllCollectionsContainingOrg("Customer");
            assertEquals(pdcArry.size(), 4);
        }

        @Test
        public void privateAssetRead() throws IOException {
            PrivateDataCollectionsUtil pdcu = new PrivateDataCollectionsUtil();
            String name = pdcu.getCollectionNameForOrg("ComponentSupplier","");
            assertEquals(name, "cCs");
        }

        //@Test
        public void newPrivateAssetCreate() throws UnsupportedEncodingException {
            Map<String, byte[]> transientMap = new HashMap<>();

            transientMap.put("privateValue", "150".getBytes(StandardCharsets.UTF_8));

            when(stub.getTransient()).thenReturn(transientMap);
            //contract.c(ctx, "002");

            verify(stub).putPrivateData(collection, "002",
                    ("{\"privateValue\":\"150\"}").getBytes(StandardCharsets.UTF_8));
        }

       // @Test
        public void alreadyExists() throws UnsupportedEncodingException {
            Exception thrown = assertThrows(RuntimeException.class, () -> {
                //contract.createOrder(ctx, "001");
            });

            assertEquals(thrown.getMessage(), "The asset order 001 already exists");
        }

       // @Test
        public void noTransient() {
            Map<String, byte[]> transientMap = new HashMap<>();

            when(stub.getTransient()).thenReturn(transientMap);
            Exception thrown = assertThrows(RuntimeException.class, () -> {
                //contract.createOrder(ctx, "002");
            });

            assertEquals(thrown.getMessage(),
                    "The privateValue key was not specified in transient data. Please try again.");
        }

        //@Test
        public void incorrectKeyTransient() throws UnsupportedEncodingException {
            Map<String, byte[]> transientMap = new HashMap<>();

            transientMap.put("someValue", "125".getBytes(StandardCharsets.UTF_8));

            when(stub.getTransient()).thenReturn(transientMap);
            Exception thrown = assertThrows(RuntimeException.class, () -> {
               // contract.createOrder(ctx, "002");
            });

            assertEquals(thrown.getMessage(),
                    "The privateValue key was not specified in transient data. Please try again.");
        }

    }


    /*

    @Nested
    class AssetReads {
        @Test
        public void privateAssetRead() throws UnsupportedEncodingException {

            when(stub.getPrivateData(collection, "001"))
                    .thenReturn(("{\"privateValue\":\"125\"}").getBytes(StandardCharsets.UTF_8));
            String expectedString = "{\"privateValue\":\"125\"}";

            String returnedAssetString = contract.readOrder(ctx, "001");
            assertEquals(expectedString, returnedAssetString);
        }

        @Test
        public void noSuchPrivateAsset() {
            Exception thrown = assertThrows(RuntimeException.class, () -> {
                contract.readOrder(ctx, "002");
            });

            assertEquals(thrown.getMessage(), "The asset order 002 does not exist");
        }
    }

    @Nested
    class AssetUpdates {
        @Test
        public void updateExisting() throws UnsupportedEncodingException {
            when(stub.getPrivateData(collection, "001"))
                    .thenReturn(("{\"privateValue\":\"125\"}").getBytes(StandardCharsets.UTF_8));
            Map<String, byte[]> transientMap = new HashMap<>();

            transientMap.put("privateValue", "150".getBytes(StandardCharsets.UTF_8));

            when(stub.getTransient()).thenReturn(transientMap);

            contract.updateOrder(ctx, "001");

            verify(stub).putPrivateData(collection, "001",
                    ("{\"privateValue\":\"150\"}").getBytes(StandardCharsets.UTF_8));
        }

        @Test
        public void updateMissing() {
            when(stub.getPrivateData(collection, "002")).thenReturn(null);

            Exception thrown = assertThrows(RuntimeException.class, () -> {
                contract.updateOrder(ctx, "002");
            });

            assertEquals(thrown.getMessage(), "The asset order 002 does not exist");
        }

    }

    @Nested
    class AssetDelete {
        @Test
        public void deleteExisting() {
            contract.deleteOrder(ctx, "001");
            verify(stub).delPrivateData(collection, "001");
        }

        @Test
        public void deleteMissing() {
            when(stub.getPrivateData(collection, "002")).thenReturn(null);

            Exception thrown = assertThrows(RuntimeException.class, () -> {
                contract.deleteOrder(ctx, "002");
            });
            assertEquals(thrown.getMessage(), "The asset order 002 does not exist");
        }
    }


    @Nested
    class AssetVerify {
        @Test
        public void verifyExistingCorrect() throws NoSuchAlgorithmException {
            Order someAsset = new Order();
            someAsset.privateValue = "125";

            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashByte = digest.digest(someAsset.toJSONString().getBytes(StandardCharsets.UTF_8));

            when(stub.getPrivateDataHash(collection, "001")).thenReturn(hashByte);

            boolean result = contract.verifyOrder(ctx, "001", someAsset);

            assertTrue(result);
        }

        @Test
        public void verifyExistingIncorrect() throws NoSuchAlgorithmException {
            Order someAsset = new Order();
            someAsset.privateValue = "125";

            when(stub.getPrivateDataHash(collection, "001")).thenReturn(("someAsset").getBytes(StandardCharsets.UTF_8));

            boolean result = contract.verifyOrder(ctx, "001", someAsset);

            assertFalse(result);
        }

        @Test
        public void verifyMissing() throws NoSuchAlgorithmException {
            Order someAsset = new Order();

            when(stub.getPrivateDataHash(collection, "002")).thenReturn(("").getBytes(StandardCharsets.UTF_8));

            Exception thrown = assertThrows(RuntimeException.class, () -> {
                contract.verifyOrder(ctx, "002", someAsset);
            });

            assertEquals(thrown.getMessage(), "No private data hash with the key: 002");

        }
    }


     */
}
