import React from 'react';
import Link from 'next/link';

const BookingButton = ({ isDisabled, tableData }) => {
  if (isDisabled) {
    return (
      <button className="disabled-button" disabled>
        Đặt bàn
      </button>
    );
  }

  return (
    <Link
      href={{
        pathname: '/booking',
        query: { table: JSON.stringify(tableData) }
      }}
      legacyBehavior
    >
      <a>
        <button>Đặt bàn</button>
      </a>
    </Link>
  );
};

export default BookingButton;