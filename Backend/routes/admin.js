// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const Product = require('../models/Product');
// const { protect, adminOnly } = require('../middleware/auth');

// // 1. DASHBOARD OVERVIEW STATS
// // @route   GET /api/admin/stats
// router.get('/stats', protect, adminOnly, async (req, res) => {
//   try {
//     // Core Metrics
//     const orders = await Order.find({});
//     const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
//     const totalOrders = orders.length;
//     const totalProducts = await Product.countDocuments({});

//     // Sales Chart Data (Last 7 Days)
//     const salesData = await Order.aggregate([
//       {
//         $match: {
//           createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
//         }
//       },
//       {
//         $group: {
//           _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
//           amount: { $sum: "$totalAmount" }
//         }
//       },
//       { $sort: { "_id": 1 } }
//     ]);

//     // Inventory Chart Data
//     const inventoryData = await Product.find({}).select('name stock -_id').limit(10);

//     res.json({
//       revenue: totalRevenue.toFixed(2),
//       orders: totalOrders,
//       products: totalProducts,
//       growth: 12.5, // Dummy value for demo
//       salesChart: salesData.map(item => ({ date: item._id, amount: item.amount })),
//       inventoryChart: inventoryData.map(item => ({ name: item.name, stock: item.stock }))
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// // 2. DETAILED ANALYTICS PAGE
// // @route   GET /api/admin/analytics
// router.get('/analytics', protect, adminOnly, async (req, res) => {
//   try {
//     // Category Distribution
//     const categoryData = await Product.aggregate([
//       {
//         $group: {
//           _id: "$category",
//           totalStock: { $sum: "$stock" },
//           productCount: { $sum: 1 }
//         }
//       }
//     ]);

//     // Order Performance Metrics
//     const orderMetrics = await Order.aggregate([
//       {
//         $group: {
//           _id: null,
//           totalRevenue: { $sum: "$totalAmount" },
//           totalOrders: { $sum: 1 },
//           paidOrders: { 
//             $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] } 
//           }
//         }
//       }
//     ]);

//     const metrics = orderMetrics[0] || { totalRevenue: 0, totalOrders: 0, paidOrders: 0 };

//     // Calculate KPIs
//     const avgOrderValue = metrics.totalOrders > 0 
//       ? (metrics.totalRevenue / metrics.totalOrders).toFixed(2) 
//       : 0;

//     const fulfillmentRate = metrics.totalOrders > 0 
//       ? ((metrics.paidOrders / metrics.totalOrders) * 100).toFixed(1) 
//       : 0;

//     res.json({
//       categories: categoryData.map(item => ({ 
//         name: item._id, 
//         value: item.totalStock 
//       })),
//       kpi: {
//         activeCategories: categoryData.length,
//         avgOrderValue: avgOrderValue,
//         fulfillmentRate: fulfillmentRate
//       }
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

// module.exports = router;

const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect, adminOnly } = require('../middleware/auth');

// 1. DASHBOARD OVERVIEW STATS
// @route   GET /api/admin/stats
router.get('/stats', protect, adminOnly, async (req, res) => {
  try {
    const storeId = req.user.store; // <--- CRITICAL: Get Store ID from token

    // Core Metrics (FILTERED BY STORE)
    const orders = await Order.find({ store: storeId });
    
    // Note: Make sure your Order model has a 'totalPrice' or 'totalAmount' field. 
    // I used 'totalPrice' based on common conventions, but swapped to 'totalAmount' to match your previous code.
    const totalRevenue = orders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const totalProducts = await Product.countDocuments({ store: storeId });

    // Sales Chart Data (Last 7 Days - FILTERED BY STORE)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesData = await Order.aggregate([
      {
        $match: {
          store: storeId, // <--- Filter by Store
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // Inventory Chart Data (FILTERED BY STORE)
    const inventoryData = await Product.find({ store: storeId })
      .select('name stock -_id')
      .limit(10);

    res.json({
      revenue: totalRevenue.toFixed(2),
      orders: totalOrders,
      products: totalProducts,
      // growth: 12.5, // You can make this dynamic later if needed
      salesChart: salesData.map(item => ({ date: item._id, amount: item.amount })),
      inventoryChart: inventoryData.map(item => ({ name: item.name, stock: item.stock }))
    });
  } catch (error) {
    console.error("Stats Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 2. DETAILED ANALYTICS PAGE
// @route   GET /api/admin/analytics
router.get('/analytics', protect, adminOnly, async (req, res) => {
  try {
    const storeId = req.user.store; // <--- CRITICAL: Get Store ID

    // Category Distribution (FILTERED BY STORE)
    const categoryData = await Product.aggregate([
      { $match: { store: storeId } }, // <--- Filter by Store first!
      {
        $group: {
          _id: "$category",
          totalStock: { $sum: "$stock" },
          productCount: { $sum: 1 }
        }
      }
    ]);

    // Order Performance Metrics (FILTERED BY STORE)
    const orderMetrics = await Order.aggregate([
      { $match: { store: storeId } }, // <--- Filter by Store first!
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          paidOrders: { 
            // Assuming status is 'Paid' or 'Delivered' - adjust string as needed
            $sum: { $cond: [{ $or: [{ $eq: ["$status", "Paid"] }, { $eq: ["$isPaid", true] }] }, 1, 0] } 
          }
        }
      }
    ]);

    const metrics = orderMetrics[0] || { totalRevenue: 0, totalOrders: 0, paidOrders: 0 };

    // Calculate KPIs
    const avgOrderValue = metrics.totalOrders > 0 
      ? (metrics.totalRevenue / metrics.totalOrders).toFixed(2) 
      : 0;

    const fulfillmentRate = metrics.totalOrders > 0 
      ? ((metrics.paidOrders / metrics.totalOrders) * 100).toFixed(1) 
      : 0;

    res.json({
      categories: categoryData.map(item => ({ 
        name: item._id || "Uncategorized", 
        value: item.totalStock 
      })),
      kpi: {
        activeCategories: categoryData.length,
        avgOrderValue: avgOrderValue,
        fulfillmentRate: fulfillmentRate
      }
    });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;