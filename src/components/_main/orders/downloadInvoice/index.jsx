'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// mui
import { Button, CircularProgress } from '@mui/material';
import { IoDownloadOutline } from 'react-icons/io5';
// react-pdf
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

DownloadInvoiceButton.propTypes = {
  orderData: PropTypes.object.isRequired
};

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: '/fonts/Roboto-Regular.ttf' },
    { src: '/fonts/Roboto-Bold.ttf', fontWeight: 'bold' }
  ]
});

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontSize: 10,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    backgroundColor: '#ffffff'
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    width: 120,
    height: 40,
    objectFit: 'contain'
  },
  companyName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  invoiceTitle: {
    fontSize: 16,
    color: '#34495e'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495e'
  },
  flexRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7'
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row'
  },
  tableColHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    backgroundColor: '#ffffff',
    color: '#000000',
    padding: 8,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  tableCol: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 8,
    textAlign: 'left',
    fontSize: 9
  },
  tableColProduct: {
    width: '40%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 8,
    textAlign: 'left',
    fontSize: 9
  },
  tableColColor: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 8,
    textAlign: 'center',
    fontSize: 9
  },
  tableColSize: {
    width: '15%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 8,
    textAlign: 'center',
    fontSize: 9
  },
  tableColQty: {
    width: '10%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 8,
    textAlign: 'center',
    fontSize: 9
  },
  tableColPrice: {
    width: '20%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7',
    padding: 8,
    textAlign: 'right',
    fontSize: 9,
    fontWeight: 'bold'
  },
  totalsContainer: {
    marginTop: 20,
    alignItems: 'flex-end'
  },
  totalsBox: {
    width: 200,
    backgroundColor: '#ecf0f1',
    padding: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bdc3c7'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5
  },
  totalFinal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopStyle: 'solid',
    borderTopWidth: 2,
    borderTopColor: '#ffffff',
    paddingTop: 5,
    fontWeight: 'bold',
    fontSize: 12
  }
});

// PDF Document Component
const InvoicePDF = ({ orderData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Image style={styles.logo} src="/logo-light.png" />
        <Text style={styles.invoiceTitle}>INVOICE</Text>
      </View>

      {/* Invoice Details */}
      <View style={[styles.section, styles.flexRow]}>
        <View>
          <Text style={styles.sectionTitle}>From:</Text>
          <Text>Ezone Technologies LLC</Text>
          <Text>TRN 100049419300003</Text>
          <Text>Shop No: 2, Belghuzooz Al Raffa Building</Text>
          <Text>Bur Dubai, Dubai, UAE.</Text>
          <Text>Tel: +9714 345 1530</Text>
          <Text>Phone: +97150 24 24 117</Text>
          <Text>Email: sales@e-zonetech.com</Text>
        </View>
        <View>
          <Text>Invoice Number: INV-{orderData?.orderNo || 'N/A'}</Text>
          <Text>Order Number: {orderData?.orderNo || 'N/A'}</Text>
          <Text>Date: {orderData?.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : 'N/A'}</Text>
          <Text>Status: {orderData?.status || 'N/A'}</Text>
          <Text>Payment Method: {orderData?.paymentMethod || 'N/A'}</Text>
        </View>
      </View>

      {/* Bill To */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text>{orderData?.user?.firstName || ''} {orderData?.user?.lastName || ''}</Text>
        <Text>{orderData?.user?.address || ''}</Text>
        <Text>{orderData?.user?.city || ''}, {orderData?.user?.state || ''} {orderData?.user?.zip || ''}</Text>
        <Text>{orderData?.user?.country || ''}</Text>
        <Text>Phone: {orderData?.user?.phone || 'N/A'}</Text>
        <Text>Email: {orderData?.user?.email || 'N/A'}</Text>
      </View>

      {/* Products Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <View style={[styles.tableColHeader, { width: '40%' }]}>
            <Text>Product</Text>
          </View>
          <View style={[styles.tableColHeader, { width: '15%' }]}>
            <Text>Color</Text>
          </View>
          <View style={[styles.tableColHeader, { width: '15%' }]}>
            <Text>Size</Text>
          </View>
          <View style={[styles.tableColHeader, { width: '10%' }]}>
            <Text>Qty</Text>
          </View>
          <View style={[styles.tableColHeader, { width: '20%' }]}>
            <Text>Price</Text>
          </View>
        </View>

        {/* Table Body */}
        {orderData?.items?.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableColProduct}>
              <Text>{item?.name || 'Product'}</Text>
            </View>
            <View style={styles.tableColColor}>
              <Text>{item?.color || '-'}</Text>
            </View>
            <View style={styles.tableColSize}>
              <Text>{item?.size || '-'}</Text>
            </View>
            <View style={styles.tableColQty}>
              <Text>{item?.quantity || 1}</Text>
            </View>
            <View style={styles.tableColPrice}>
              <Text>AED {(item?.priceSale || item?.price || 0).toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsContainer}>
        <View style={styles.totalsBox}>
          {(() => {
            const TAX_RATE = 0.05;
            const subTotal = orderData?.subTotal ?? orderData?.subtotal ?? 0;
            const shipping = orderData?.shipping ?? 0;
            const discount = orderData?.discount ?? 0;
            const tax = orderData?.tax !== undefined && orderData?.tax !== null ? orderData.tax : Math.max(0, (subTotal - discount) * TAX_RATE);
            const finalTotal = orderData?.total !== undefined && orderData?.total !== null ? orderData.total : subTotal + shipping + tax - discount;
            return (
              <>
                <View style={styles.totalRow}>
                  <Text>Subtotal:</Text>
                  <Text>AED {subTotal.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text>Shipping:</Text>
                  <Text>AED {shipping.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text>Tax:</Text>
                  <Text>AED {tax.toFixed(2)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.totalRow}>
                    <Text>Discount:</Text>
                    <Text>AED -{discount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.totalFinal}>
                  <Text>TOTAL:</Text>
                  <Text>AED {finalTotal.toFixed(2)}</Text>
                </View>
              </>
            );
          })()}
        </View>
      </View>

      {/* Footer */}
      <View style={{ marginTop: 30, textAlign: 'center', fontSize: 8, color: '#7f8c8d' }}>
        <Text>Thank you for your business!</Text>
        <Text>For questions about this invoice, contact us at support@ezone.com</Text>
        <Text>This is a computer-generated invoice.</Text>
      </View>
    </Page>
  </Document>
);

export default function DownloadInvoiceButton({ orderData }) {
  return (
    <PDFDownloadLink
      document={<InvoicePDF orderData={orderData} />}
      fileName={`Invoice-${orderData?.orderNo || Date.now()}.pdf`}
      style={{ textDecoration: 'none' }}
    >
      {({ loading }) => (
        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <IoDownloadOutline />}
          disabled={loading}
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '16px',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            '&:hover': {
              boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          {loading ? 'Generating PDF...' : 'Download Invoice'}
        </Button>
      )}
    </PDFDownloadLink>
  );
}