package org.supplychain;

import com.google.gson.Gson;
import org.hyperledger.fabric.contract.annotation.Property;

import java.util.List;

public class AccessRequestList {

    private final static Gson geson = new Gson();

    @Property()
    private List<AccessRequest> accessRequests;

    public List<AccessRequest> getAccessRequests() {
        return accessRequests;
    }

    public void setAccessRequests(List<AccessRequest> accessRequests) {
        this.accessRequests = accessRequests;
    }

    @Override
    public String toString() {
        return "AccessRequestList{" +
                "accessRequests=" + accessRequests +
                '}';
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static AccessRequestList fromJSONString(String json) {
        AccessRequestList asset = geson.fromJson(json, AccessRequestList.class);
        return asset;
    }
}
