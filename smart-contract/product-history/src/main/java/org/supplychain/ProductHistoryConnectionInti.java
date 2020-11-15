package org.supplychain;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

public class ProductHistoryConnectionInti {

    static OrderDetails m001 = new OrderDetails("MOO1", "Customer", LocalDate.now().plusDays(1).toString(), "Product Order Placement");
    static OrderDetails rs001 = new OrderDetails("RSOO1", "Raw Material Supplier", LocalDate.now().plusDays(2).toString(), "Raw Materials Order Placement");
    static OrderDetails rs002 = new OrderDetails("RSOO2", "Raw Material Supplier", LocalDate.now().plusDays(3).toString(), "Raw Materials Delivery");
        static OrderDetails s001 = new OrderDetails("SOO1", "Supplier", LocalDate.now().plusDays(4).toString(), "Component Order Placement");
    static OrderDetails s002 = new OrderDetails("SOO2", "Supplier", LocalDate.now().plusDays(5).toString(), "Manufacturing");
    static OrderDetails s003 = new OrderDetails("SOO3", "Supplier", LocalDate.now().plusDays(6).toString(), "Component Delivery");
    static OrderDetails m002 = new OrderDetails("MOO2", "Manufacturer", LocalDate.now().plusDays(7).toString(), "Manufacturing");
    static OrderDetails m003 = new OrderDetails("MOO3", "Manufacturer", LocalDate.now().plusDays(8).toString(), "Testing");
    static OrderDetails m004 = new OrderDetails("MOO4", "Manufacturer", LocalDate.now().plusDays(9).toString(), "Product Delivery");


    static ProductHistoryConnection C1 = new ProductHistoryConnection("C1", m001, s001);
    static ProductHistoryConnection C2 = new ProductHistoryConnection("C2", s001, rs001);
    static ProductHistoryConnection C3 = new ProductHistoryConnection("C3", rs001, rs002);
    static ProductHistoryConnection C4 = new ProductHistoryConnection("C4", s001, s002);
    static ProductHistoryConnection C5 = new ProductHistoryConnection("C5", s001, s003);
    static ProductHistoryConnection C6 = new ProductHistoryConnection("C6", m001, m002);
    static ProductHistoryConnection C7 = new ProductHistoryConnection("C7", m001, m003);
    static ProductHistoryConnection C8 = new ProductHistoryConnection("C8", m001, m004);

    public static List<ProductHistoryConnection> getData() {
        List<ProductHistoryConnection> l = new ArrayList<>();
        l.add(C1);
        l.add(C2);
        l.add(C3);
        l.add(C4);
        l.add(C5);
        l.add(C6);
        l.add(C7);
        l.add(C8);
        return l;
    }
}
