export interface Dashmodel {
  latestOrders: {
    orderID: number;
    orderDate: string;
    totalAmount: number;
  }[];
  newOrders: number;
  dispatchedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
}