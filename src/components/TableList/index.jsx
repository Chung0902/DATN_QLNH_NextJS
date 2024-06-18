import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import TableItem from '../TableItem';
import axiosClient from '@/libraries/axiosClient';
import styles from './TabletList.module.css';

const TabletList = () => {
  const [tables, setTables] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const fetchTables = async () => {
    try {
      const response = await axiosClient.get('/user/tables');
      setTables(response.data.payload);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // Tính toán các sản phẩm cho trang hiện tại
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTables = tables.slice(indexOfFirstItem, indexOfLastItem);

  // Tính toán tổng số trang
  const totalPages = Math.ceil(tables.length / itemsPerPage);

  // Xử lý chuyển trang
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div style={{ paddingBottom: '40px', paddingTop: '10px' }}>
      <section id="sellers">
        <div className="seller container">
          <span className="abc">
            <h3 className={styles.h3}></h3>
          </span>
          {currentTables.length > 0 ? (
            <div className="best-seller">
              {currentTables.map((table) => (
                <Link key={table._id} href={`/tables/${table._id}`}>
                  <TableItem
                    _id={table._id}
                    photo={table.photo}
                    name={table.name}
                    numberOfSeats={table.numberOfSeats}
                    setup={table.setup}
                    status={table.status}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <small>Không có bàn ăn</small>
          )}
          {/* Điều khiển phân trang */}
          <div className={styles.pagination}>
            <button 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                onClick={() => handlePageChange(index + 1)}
                className={currentPage === index + 1 ? styles.active : ''}
              >
                {index + 1}
              </button>
            ))}
            <button 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TabletList;