import React from "react";

interface ProductDataTabProps {
    productData: any;
    productDataTab: string;
    setProductDataTab: (tab: string) => void;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ProductDataTab: React.FC<ProductDataTabProps> = ({
    productData,
    productDataTab,
    setProductDataTab,
    handleChange,
}) => (
    <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Vertical Tabs */}
        <div className="flex flex-col gap-2 border-r pr-4 min-w-[150px]">
            {["General", "Inventory", "Shipping", "Advanced", "Product Badge"].map((tab) => (
                <button
                    key={tab}
                    type="button"
                    onClick={() => setProductDataTab(tab)}
                    className={`text-left px-3 py-2 border rounded text-xs ${productDataTab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>

        {/* Right: Tab Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-1 gap-4">
            {productDataTab === "General" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Regular Price</label>
                        <input
                            type="number"
                            name="ProductPrice"
                            value={productData.ProductPrice || ""}
                            onChange={handleChange}
                            placeholder="Price"
                            className="border rounded p-2 text-xs w-full"
                            required
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Sale Price</label>
                        <input
                            type="number"
                            name="ProductSalePrice"
                            value={productData.ProductSalePrice || ""}
                            onChange={handleChange}
                            placeholder="Sale Price"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                </div>
            )}

            {productDataTab === "Inventory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">SKU</label>
                        <input
                            name="ProductSku"
                            value={productData.ProductSku || ""}
                            onChange={handleChange}
                            placeholder="SKU"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">GTIN, UPC, EAN, or ISBN</label>
                        <input
                            name="ProductBarcode"
                            value={productData.ProductBarcode || ""}
                            onChange={handleChange}
                            placeholder="Barcode"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Stock Quantity</label>
                        <input
                            type="number"
                            name="ProductStockQuantity"
                            value={productData.ProductStockQuantity || ""}
                            onChange={handleChange}
                            placeholder="Stock Quantity"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Stock Status</label>
                        <select
                            name="StockStatus"
                            value={productData.StockStatus || ""}
                            onChange={handleChange}
                            className="border rounded p-2 text-xs w-full"
                        >
                            <option value="In Stock">In Stock</option>
                            <option value="Out of Stock">Out of Stock</option>
                            <option value="In Stock">On Backorder</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Allow Backorders</label>
                        <select
                            name="AllowBackorders"
                            value={productData.AllowBackorders || ""}
                            onChange={handleChange}
                            className="border rounded p-2 text-xs w-full"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                            <option value="Notify Customer">Notify Customer</option>
                        </select>
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Sold Individually</label>
                        <select
                            name="SoldIndividually"
                            value={productData.SoldIndividually || ""}
                            onChange={handleChange}
                            className="border rounded p-2 text-xs w-full"
                        >
                            <option value="No">No</option>
                            <option value="Yes">Yes</option>
                        </select>
                    </div>
                </div>
            )}

            {productDataTab === "Shipping" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            name="ProductWeight"
                            value={productData.ProductWeight || ""}
                            onChange={handleChange}
                            placeholder="Weight (kg)"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Length</label>
                        <input
                            type="number"
                            name="ProductLength"
                            value={productData.ProductLength || ""}
                            onChange={handleChange}
                            placeholder="Length"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Width</label>
                        <input
                            type="number"
                            name="ProductWidth"
                            value={productData.ProductWidth || ""}
                            onChange={handleChange}
                            placeholder="Width"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Height</label>
                        <input
                            type="number"
                            name="ProductHeight"
                            value={productData.ProductHeight || ""}
                            onChange={handleChange}
                            placeholder="Height"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Shipping Class</label>
                        <input
                            name="ShippingClass"
                            value={productData.ShippingClass || ""}
                            onChange={handleChange}
                            placeholder="Shipping Class"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                </div>
            )}

            {productDataTab === "Advanced" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Purchase Note</label>
                        <textarea
                            name="PurchaseNote"
                            value={productData.PurchaseNote || ""}
                            onChange={handleChange}
                            placeholder="Purchase Note"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Menu Order</label>
                        <input
                            type="number"
                            name="MenuOrder"
                            value={productData.MenuOrder || ""}
                            onChange={handleChange}
                            placeholder="Menu Order"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Enable Reviews</label>
                        <select
                            name="EnableReviews"
                            value={productData.EnableReviews || ""}
                            onChange={handleChange}
                            className="border rounded p-2 text-xs w-full"
                        >
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                    </div>
                </div>
            )}

            {productDataTab === "Product Badge" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <div className="w-full">
                        <label className="block text-xs font-bold mb-1">Product Badge</label>
                        <input
                            name="ProductBadge"
                            value={productData.ProductBadge || ""}
                            onChange={handleChange}
                            placeholder="Product Badge"
                            className="border rounded p-2 text-xs w-full"
                        />
                    </div>
                </div>
            )}
        </div>
    </div>
);

export default ProductDataTab;