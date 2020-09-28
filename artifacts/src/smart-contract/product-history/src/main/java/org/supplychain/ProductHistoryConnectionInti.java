package org.supplychain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProductHistoryConnectionInti {

    static ProductHistory m001 = new ProductHistory("MOO1", "Customer", LocalDate.now().plusDays(1).toString(), "");
    static ProductHistory s001 = new ProductHistory("SOO1", "Supplier", LocalDate.now().plusDays(2).toString(), "");
    static ProductHistory rs001 = new ProductHistory("RSOO1", "Raw Material Supplier", LocalDate.now().plusDays(3).toString(), "");
    static ProductHistory rs002 = new ProductHistory("RSOO2", "Raw Material Supplier", LocalDate.now().plusDays(4).toString(), "");
    static ProductHistory s002 = new ProductHistory("SOO2", "Supplier", LocalDate.now().plusDays(5).toString(), "");
    static ProductHistory s003 = new ProductHistory("SOO3", "Supplier", LocalDate.now().plusDays(6).toString(), "");
    static ProductHistory m002 = new ProductHistory("MOO2", "Manufacturer", LocalDate.now().plusDays(7).toString(), "");
    static ProductHistory m003 = new ProductHistory("MOO3", "Manufacturer", LocalDate.now().plusDays(8).toString(), "");

    static ProductHistoryConnection C1 = new ProductHistoryConnection("C1", m001, s001);
    static ProductHistoryConnection C2 = new ProductHistoryConnection("C2", s001, rs001);
    static ProductHistoryConnection C3 = new ProductHistoryConnection("C3", rs001, rs002);
    static ProductHistoryConnection C4 = new ProductHistoryConnection("C4", s001, s002);
    static ProductHistoryConnection C5 = new ProductHistoryConnection("C5", s001, s003);
    static ProductHistoryConnection C6 = new ProductHistoryConnection("C6", m001, m002);
    static ProductHistoryConnection C7 = new ProductHistoryConnection("C7", m001, m003);

    public static List<ProductHistoryConnection> getData() {
        List<ProductHistoryConnection> l = new ArrayList<>();
        l.add(C1);
        l.add(C2);
        l.add(C3);
        l.add(C4);
        l.add(C5);
        l.add(C6);
        l.add(C7);
        return l;
    }
}
