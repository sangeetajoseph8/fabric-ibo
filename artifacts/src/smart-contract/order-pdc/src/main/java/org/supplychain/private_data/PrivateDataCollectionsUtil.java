package org.supplychain.private_data;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.google.gson.Gson;

public class PrivateDataCollectionsUtil {
    private final static Gson geson = new Gson();


    //TODO: Get the JSON from the collections.json
    String collectionJson = "[\n" +
            "     {\n" +
            "          \"name\": \"cCu\",\n" +
            "          \"policy\": \"OR('CustomerMSP.member')\",\n" +
            "          \"requiredPeerCount\": 1,\n" +
            "          \"maxPeerCount\": 1,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cCuMa\",\n" +
            "          \"policy\": \"OR('CustomerMSP.member', 'ManufacturerMSP.member')\",\n" +
            "          \"requiredPeerCount\": 1,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cCuRms\",\n" +
            "          \"policy\": \"OR('CustomerMSP.member', 'RawMaterialSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 2,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cCuCs\",\n" +
            "          \"policy\": \"OR('CustomerMSP.member', 'ComponentSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 2,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cMa\",\n" +
            "          \"policy\": \"OR('ManufacturerMSP.member')\",\n" +
            "          \"requiredPeerCount\": 1,\n" +
            "          \"maxPeerCount\": 1,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cMaRms\",\n" +
            "          \"policy\": \"OR('ManufacturerMSP.member', 'RawMaterialSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 2,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cMaCs\",\n" +
            "          \"policy\": \"OR('ManufacturerMSP.member', 'ComponentSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 2,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cRms\",\n" +
            "          \"policy\": \"OR('RawMaterialSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 1,\n" +
            "          \"maxPeerCount\": 1,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cRmsCs\",\n" +
            "          \"policy\": \"OR('RawMaterialSupplierMSP.member', 'ComponentSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 2,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     },\n" +
            "     {\n" +
            "          \"name\": \"cCs\",\n" +
            "          \"policy\": \"OR('ComponentSupplierMSP.member')\",\n" +
            "          \"requiredPeerCount\": 1,\n" +
            "          \"maxPeerCount\": 2,\n" +
            "          \"blockToLive\": 0,\n" +
            "          \"memberOnlyRead\": true,\n" +
            "          \"memberOnlyWrite\": true\n" +
            "     }\n" +
            "]";

    public List<PrivateDataCollection> getCollectionList() throws IOException {
        // TODO: Change this logic to get the list of private data collections
        PrivateDataCollection[] pdc = geson.fromJson(collectionJson, PrivateDataCollection[].class);
        return Arrays.asList(pdc);
    }

    public List<String> getAllCollectionsContainingOrg(String orgName) throws IOException {
        List<PrivateDataCollection> pdcList = getCollectionList();
        List<String> collectionNameList = new ArrayList<>();
        for (PrivateDataCollection pdc : pdcList) {
            if (pdc.getPolicy().contains(orgName)) {
                collectionNameList.add(pdc.getName());
            }
        }
        return collectionNameList;
    }

    public String getCollectionNameForOrg(String orgName1, String orgName2) throws IOException {
        List<PrivateDataCollection> pdcList = getCollectionList();
        String pdcName = new String();

        // Retrun PDC containing both the Org Names
        if (orgName1 != null && orgName2 != null && !orgName1.isEmpty() && !orgName2.isEmpty()) {
            for (PrivateDataCollection pdc : pdcList) {
                if (pdc.getPolicy().contains(orgName1) && pdc.getPolicy().contains(orgName2)) {
                    return pdc.getName();
                }
            }
            return "";
        }

        // Look for PDC with only one Org.
        for (PrivateDataCollection pdc : pdcList) {
            if (!pdc.getPolicy().contains(",") && pdc.getPolicy().contains(orgName1)) {
                return pdc.getName();
            }
        }
        return "";
    }
}
