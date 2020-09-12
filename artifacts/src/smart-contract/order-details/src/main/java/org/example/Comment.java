package org.example;

import com.google.gson.Gson;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

@DataType
public class Comment {

    private final static Gson geson = new Gson();

    public Comment(String commentString, String publishedDate) {
        this.commentString = commentString;
        this.publishedDate = publishedDate;
    }

    @Property
    private String commentString;

    @Property
    private String publishedDate;

    public String getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(String publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getCommentString() {
        return commentString;
    }

    public void setCommentString(String commentString) {
        this.commentString = commentString;
    }

    public String toJSONString() {
        return geson.toJson(this);
    }

    public static Comment fromJSONString(String json) {
        return geson.fromJson(json, Comment.class);
    }

    @Override
    public String toString() {
        return "Comment{" +
                "commentString='" + commentString + '\'' +
                ", publishedDate=" + publishedDate +
                '}';
    }
}
