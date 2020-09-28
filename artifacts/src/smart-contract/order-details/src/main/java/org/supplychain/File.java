package org.supplychain;

import com.google.gson.Gson;
import jdk.nashorn.internal.objects.annotations.Property;

public class File {
    private final static Gson geson = new Gson();

    @Property
    private String name;

    @Property
    private String hash;

    public File(String name, String hash) {
        this.name = name;
        this.hash = hash;
    }

    public String getName() {
        return name;
    }

    public String getHash() {
        return hash;
    }

    @Override
    public String toString() {
        return "File{" +
                "name='" + name + '\'' +
                ", hash='" + hash + '\'' +
                '}';
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static File fromJSONString(String json) {
        return geson.fromJson(json, File.class);
    }

}
