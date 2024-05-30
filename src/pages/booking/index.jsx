import React from "react";
import jwt_decode from "jwt-decode";
import { PayPalButton } from "react-paypal-button-v2";
import { IoLocationSharp } from "react-icons/io5";
import { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { useRouter } from "next/router";
import { FaPlusSquare } from "react-icons/fa";

import styles from "./Order.module.css";
import HeadMeta from "@/components/HeadMeta";
import axiosClient from "@/libraries/axiosClient";
import { getTokenFromLocalStorage } from "@/utils/tokenUtils";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";



const Booking = ({products}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [wards, setWards] = useState([]);
  const [selectedWard, setSelectedWard] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [isPaymentShown, setIsPaymentShown] = useState(false);
  const [isPayPalActive, setIsPayPalActive] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const router = useRouter();
  const [productId, setProductId] = useState("");


  const [showNewRow, setShowNewRow] = useState(false);
  const [newRows, setNewRows] = useState([]);
  

  const { table } = router.query;
  const selectedTable = table ? JSON.parse(table) : null;

  const { totalPrice, discount } = router.query;

  const totalPriceValue = totalPrice ? parseFloat(totalPrice) : 0;

  const [showTable, setShowTable] = useState(false);

  const [discountValue, setDiscountValue] = useState(0);

  const totalProductPrice = newRows.reduce((total, row) => {
    return total + row.totalOrderDetailPrice;
  }, 0);

  const totalPayment = totalProductPrice * (1 - discountValue / 100);


   // Hàm xử lý thay đổi khi chọn sản phẩm hoặc thay đổi số lượng
   const handleNewRowChange = (e, index, field) => {
    const { value } = e.target;

    if (field === "productId") {
      const product = products.find((product) => product._id === value);
      if (product) {
        setNewRows((prevRows) => {
          const updatedRows = [...prevRows];
          updatedRows[index] = {
            ...updatedRows[index],
            [field]: value,
            productPrice: product.price,
            productDiscount: product.discount,
            productStock: product.stock, // Thêm thuộc tính `productStock`
            quantity: 1, // Đặt số lượng mặc định là 1 khi chọn sản phẩm
            totalOrderDetailPrice:
              product.price * 1 * (1 - product.discount / 100),
          };
          return updatedRows;
        });
      }
    } else if (field === "quantity") {
      const parsedValue = parseInt(value, 10);
      setNewRows((prevRows) => {
        const updatedRows = [...prevRows];
        const currentRow = updatedRows[index];
        const product = products.find(
          (product) => product._id === currentRow.productId
        );

        if (product) {
          const newQuantity = Math.max(1, Math.min(parsedValue, product.stock));
          updatedRows[index] = {
            ...currentRow,
            [field]: newQuantity,
            totalOrderDetailPrice:
              currentRow.productPrice *
              newQuantity *
              (1 - currentRow.productDiscount / 100), // Cập nhật tổng tiền khi số lượng thay đổi
          };
        }
        return updatedRows;
      });
    }
  };
  

  const handleDeleteNewRow = (index) => {
    setNewRows((prevRows) => {
      const updatedRows = [...prevRows];
      updatedRows.splice(index, 1);
      return updatedRows;
    });
  };

  const handleAddNewItem = () => {
    setShowTable(true);
    const newRow = {
      productId: "",
      quantity: 1, // Đặt số lượng mặc định là 1 khi thêm hàng mới
      productPrice: "",
      productDiscount: "",
      totalOrderDetailPrice: "",
    };
    setNewRows((prevRows) => [...prevRows, newRow]);
  };

  useEffect(() => {
    const token = getTokenFromLocalStorage();

    if (token) {
      try {
        // Giải mã token để lấy thông tin customerId
        const decodedToken = jwt_decode(token);
        const {
          _id: customerId,
          firstName: firstName,
          lastName: lastName,
          phoneNumber: phoneNumber,
          address: address,
        } = decodedToken;
        setCustomerId(customerId);
        setPhoneNumber(phoneNumber);
        setFullName(firstName + " " + lastName);
        setAddress(address);
      } catch (error) {
        console.error("Error decoding token:", error);
        setCustomerId(null);
      }
    }
  }, []);

  //Xử lý thông tin địa chỉ
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    setSelectedDistrict("");
    setSelectedWard("");

    const selectedCityData = cities.find(
      (city) => city.Id === event.target.value
    );
    setDistricts(selectedCityData?.Districts || []);
  };

  const handleDistrictChange = (event) => {
    setSelectedDistrict(event.target.value);
    setSelectedWard("");

    const selectedCityData = cities.find((city) => city.Id === selectedCity);
    const selectedDistrictData = selectedCityData?.Districts.find(
      (district) => district.Id === event.target.value
    );
    setWards(selectedDistrictData?.Wards || []);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setFullName(fullName);
    setPhoneNumber(phoneNumber);
    // Lấy tên của tỉnh/thành phố, quận/huyện và phường/xã từ state để tạo địa chỉ hoàn chỉnh
    const selectedCityData = cities.find((city) => city.Id === selectedCity);
    const selectedDistrictData = selectedCityData?.Districts.find(
      (district) => district.Id === selectedDistrict
    );
    const selectedWardData = selectedDistrictData?.Wards.find(
      (ward) => ward.Id === selectedWard
    );
    // Tạo địa chỉ hoàn chỉnh
    const completeAddress = `${selectedWardData?.Name || ""}, ${selectedDistrictData?.Name || ""
      }, ${selectedCityData?.Name || ""}, ${addressDetail || ""}`;
    // Cập nhật địa chỉ hoàn chỉnh vào state địa chỉ
    setAddress(completeAddress);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }


  // Xử lý khi nhấn nút "Thanh toán"
  const handlePayment = async () => {
    try {
      const token = getTokenFromLocalStorage();
      if (token && selectedTable) { // Kiểm tra selectedTable tồn tại
        const orderDetails = newRows.map((row) => ({
          productId: row.productId,
          quantity: row.quantity,
          price: row.productPrice,
        }));
  
        const orderData = {
          createdDate: new Date().toISOString(),
          paymentType: "CASH",
          status: "WAITING",
          shippingAddress: address,
          discount: discountValue,
          customerId: customerId,
          orderDetails: orderDetails,
          tableId: selectedTable._id,
          isDelete: false,
        };
  
        const headers = {
          Authorization: `Bearer ${token}`,
        };
  
        const response = await axiosClient.post("/user/orders", orderData, {
          headers,
        });
  
        console.log("Đơn hàng đã được tạo:", response.data);
  
        // Cập nhật stock sau khi thanh toán thành công
        for (const row of newRows) {
          const product = products.find((p) => p._id === row.productId);
          if (product) {
            const newStock = product.stock - row.quantity;
            await axiosClient.patch(`/user/products/${product._id}`, {
              stock: newStock,
            });
            console.log(`Đã cập nhật stock của sản phẩm ${product._id} thành công!`);
          }
        }
  
        router.push("/checkoutSuccess");
      } else {
        console.error("Selected table is not available!");
        // Thêm xử lý thông báo hoặc hành động phù hợp khi selectedTable không tồn tại
      }
    } catch (error) {
      alert("Lỗi!!! Tạo đơn hàng thất bại", error);
    }
  };
  

  const onSuccessPaypal = async (details, data) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      try {
        const orderDetails = selectedProducts.map((product) => ({
          productId: product._id,
          quantity: product.quantity,
          price: product.price,
        }));
        const orderData = {
          createdDate: new Date().toISOString(), // Ngày tạo đơn hàng là ngày hiện tại
          paymentType: "CREDIT CARD",
          status: "WAITING",
          shippingAddress: address,
          discount: discount,
          customerId: customerId,
          orderDetails: orderDetails,
          tableId: selectedTable._id,
          isDelete: false,
        };

        // Đưa headers vào trong object headers
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const response = await axiosClient.post("/user/orders", orderData, {
          headers,
        });

        console.log("Đơn hàng đã được tạo:", response.data);

        // Cập nhật stock sau khi thanh toán thành công
        for (const product of selectedProducts) {
          const newStock = product.stock - product.quantity;

          // Gửi yêu cầu cập nhật stock lên server
          await axiosClient.patch(`/user/products/${product._id}`, {
            stock: newStock,
          });

          // Nếu cần, bạn có thể thực hiện xử lý báo cáo, ghi log hoặc thông báo về việc cập nhật stock thành công
          console.log(
            `Đã cập nhật stock của sản phẩm ${product._id} thành công!`
          );
        }

        router.push("/checkoutSuccess");
      } catch (error) {
        alert("Lỗi!!!Tạo đơn hàng thất bại", error);
      }
    }
  };

  useEffect(() => {
    const token = getTokenFromLocalStorage();
    const fetchData = async () => {
      try {
        const response = await axiosClient.get(
          "https://datn-qlnh-nodejs.onrender.com/user/orders/payment", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
        );
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://www.paypal.com/sdk/js?client-id=${response.data.data}`;
        script.async = true;
        script.onload = () => {
          setSdkReady(true)
        }
        document.body.appendChild(script);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (!window.paypal) {
      fetchData();
    } else {
      setSdkReady(true);
    }
  }, []);


  const handlePayPalClick = () => {
    setIsPayPalActive(true);
  };

  const handleCODClick = () => {
    setIsPayPalActive(false);
  };

  const handlePaymentToggle = () => {
    setIsPaymentShown(!isPaymentShown);
  };



  return (
    <div style={{ backgroundColor: " #f7f7f7" }}>
      <HeadMeta title="Booking" />
      <Header />
      <main className={`${styles.body} container`}>
        <h1 className={styles.heading}>Chi tiết đơn đặt</h1>
        <div className={styles.wrapperAddress}>
          <div className={styles.addressTitle}>
            <h2 className={styles.title}>
              <IoLocationSharp />
              Địa chỉ
            </h2>
            <div>
              <p className={styles.p}>{fullName}</p>
              <p className={styles.p} style={{ marginTop: "-14px" }}>
                {phoneNumber}
              </p>
            </div>
          </div>
          <div className={styles.addressInfo}>
            <p>{address}</p>
            <p className={styles.p} onClick={showModal}>
              Thay đổi
            </p>
            <Modal
              title="Nhập địa"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div className={styles.inputInModal}>
                <input
                  type="text"
                  placeholder="Nhập họ tên"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                />
                <input
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                />
              </div>
              <div className={styles.selectLocation}>
                <select
                  className="form-select form-select-sm mb-3"
                  id="city"
                  aria-label=".form-select-sm"
                  value={selectedCity}
                  onChange={handleCityChange}
                >
                  <option value="">Chọn tỉnh thành</option>
                  {cities.map((city) => (
                    <option key={city.Id} value={city.Id}>
                      {city.Name}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select form-select-sm mb-3"
                  id="district"
                  aria-label=".form-select-sm"
                  value={selectedDistrict}
                  onChange={handleDistrictChange}
                >
                  <option value="">Chọn quận huyện</option>
                  {districts.map((district) => (
                    <option key={district.Id} value={district.Id}>
                      {district.Name}
                    </option>
                  ))}
                </select>

                <select
                  className="form-select form-select-sm"
                  id="ward"
                  aria-label=".form-select-sm"
                  value={selectedWard}
                  onChange={(event) => setSelectedWard(event.target.value)}
                >
                  <option value="">Chọn phường xã</option>
                  {wards.map((ward) => (
                    <option key={ward.Id} value={ward.Id}>
                      {ward.Name}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className={styles.locationDetail}
                type="text"
                placeholder="Địa chỉ cụ thể"
                value={addressDetail}
                onChange={(event) => setAddressDetail(event.target.value)}
              />
            </Modal>
          </div>
        </div>
        <div className={styles.wrapperProductsOrder}>
          <table className={styles.productList}>
            <tbody>
              <tr>
                <th style={{ textAlign: "left" }}>Tên bàn</th>
                <th>Số lượng ghế</th>
                <th>Setup</th>
                <th>Trạng thái</th>
              </tr>
              {selectedTable && (
                <tr key={selectedTable._id}>
                  <td style={{ display: "flex", alignItems: "center" }}>
                    <img src={selectedTable.photo} alt="" />
                    <p>{selectedTable.name}</p>
                  </td>
                  <td className={styles.tdPrice}>{selectedTable.numberOfSeats}</td>
                  <td className={styles.tdQuantity}>{selectedTable.setup}</td>
                  <td className={styles.tdTotal}>{selectedTable.status}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.wrapperProductsOrder}>
  <table>
    <button
      type="button"
      title="Thêm món ăn"
      onClick={handleAddNewItem}
      className={styles.addproduct}
    >
      CHỌN MÓN ĂN
    </button>
  </table>
  {showTable && (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Sản phẩm</th>
            <th>Số lượng</th>
            <th>Giá</th>
            <th>Giảm giá</th>
            <th>Tổng tiền</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {newRows.map((row, index) => (
            <tr key={index}>
              <td>
                <select
                  value={row.productId}
                  onChange={(e) =>
                    handleNewRowChange(e, index, "productId")
                  }
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((product) => (
                    product.stock > 0 && (
                      <option key={product._id} value={product._id}>
                        {product.name}
                      </option>
                    )
                  ))}
                </select>
              </td>
              <td>
                <input
                  type="number"
                  value={row.quantity}
                  onChange={(e) =>
                    handleNewRowChange(e, index, "quantity")
                  }
                  min="1"
                  max={row.productStock} // Giới hạn số lượng tối đa
                />
              </td>
              <td>{row.productPrice}</td>
              <td>{row.productDiscount}%</td>
              
              <td>{row.totalOrderDetailPrice}</td>
              <td>
                <button
                  onClick={() => handleDeleteNewRow(index)}
                  className={styles.deleteButton}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      )}
    </div>
        <div className={styles.wrapperPay}>
          <div className={styles.payMethod}>
            <h3>Phương thức thanh toán:</h3>
            {isPaymentShown ? (
              <div style={{ display: 'flex' }} className={styles.changePayment}>
                <div
                  className={`${styles.paymentItem} ${isPayPalActive ? styles.active : ''}`}
                  onClick={handlePayPalClick}
                >
                  PayPal
                </div>
                <div
                  className={`${styles.paymentItem} ${!isPayPalActive ? styles.active : ''}`}
                  onClick={handleCODClick}
                >
                  Thanh toán khi hoàn thành
                </div>
              </div>
            ) : (
              <div className={styles.payBefore} style={{ display: 'flex' }}>
                <p>Thanh toán khi hoàn thành</p>
                <span onClick={handlePaymentToggle}>Thay đổi</span>
              </div>
            )}
          </div>
          <div className={styles.totalPriceAfter}>
            <table>
              <tbody>
                <tr>
                  <td>Tổng tiền:</td>
                  <td>{totalProductPrice.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                </tr>
                <tr>
                  <td>Mã giảm giá:</td>
                  <td>
                  <input
                    type="text"
                    placeholder="Nhập mã giảm giá"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                  />
                  </td>
                </tr>
                <tr>
                  <td>Tổng thanh toán:</td>
                  <td className={styles.td}>{totalPayment.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            {isPayPalActive && sdkReady ? (
              <div className={styles.btnPaypal}>
                <div style={{ width: "200px" }}>
                  <PayPalButton
                    amount={Math.round((totalPriceValue + 0) / 23678)}
                    onSuccess={onSuccessPaypal}
                    onError={() => {
                      alert('Error')
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.btn}>
                <button style={{ width: "200px" }} onClick={handlePayment}>
                  Đặt đơn
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;

export async function getServerSideProps() {
  try {
    const response = await axiosClient.get("/user/products");

    return {
      props: {
        products: response.data.payload,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
