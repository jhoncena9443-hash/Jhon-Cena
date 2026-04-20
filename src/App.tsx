/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, ChangeEvent } from 'react';
import { Plus, Trash2, Printer, Building2, User, FileText, IndianRupee } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { InvoiceData, InvoiceItem } from './types';
import { calculateTotals } from './utils';

const initialData: InvoiceData = {
  seller: {
    name: "M.S.V.JEWELLERS",
    address: "No.9/66A, VENKATASAMY STREET,\nSALEM",
    gstin: "33APTPM0177J2ZI",
    stateName: "Tamil Nadu",
    stateCode: "33",
    email: "prmurali76@gmail.com"
  },
  consignee: {
    name: "ABHARAN JEWELLERS PRIVATE LIMITED",
    address: "10-3-4, CORPORATION BANK ROAD,\nUDUPI,\nKARNATAKA",
    gstin: "29AAJCA8026E1ZN",
    stateName: "Karnataka",
    stateCode: "29"
  },
  buyer: {
    name: "ABHARAN JEWELLERS PRIVATE LIMITED",
    address: "10-3-4, CORPORATION BANK ROAD,\nUDUPI,\nKARNATAKA",
    gstin: "29AAJCA8026E1ZN",
    stateName: "Karnataka",
    stateCode: "29"
  },
  invoice: {
    invoiceNumber: "1",
    date: "2025-04-01",
    deliveryNote: "",
    paymentMode: "",
    referenceNo: "",
    otherReferences: ""
  },
  shipping: {
    buyersOrderNo: "",
    orderDated: "",
    dispatchDocNo: "",
    deliveryNoteDate: "",
    dispatchedThrough: "",
    destination: "",
    termsOfDelivery: ""
  },
  items: [
    {
      id: '1',
      description: "Labour Services Charge",
      hsnSac: "998892",
      quantity: "",
      rate: 10000,
      per: "",
      amount: 10000
    }
  ],
  tax: {
    cgstPercent: 0,
    sgstPercent: 0,
    igstPercent: 5
  }
};

export default function App() {
  const [data, setData] = useState<InvoiceData>(initialData);

  const totals = useMemo(() => calculateTotals(data.items, data.tax), [data.items, data.tax]);

  const handleSellerChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, seller: { ...prev.seller, [name]: value } }));
  };

  const handlePartyChange = (party: 'consignee' | 'buyer', e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [party]: { ...prev[party], [name]: value } }));
  };

  const handleInvoiceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, invoice: { ...prev.invoice, [name]: value } }));
  };

  const handleShippingChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, shipping: { ...prev.shipping, [name]: value } }));
  };

  const handleTaxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, tax: { ...prev.tax, [name]: parseFloat(value) || 0 } }));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value };
          if (field === 'quantity' || field === 'rate') {
            const q = parseFloat(updatedItem.quantity || '1');
            updatedItem.amount = q * updatedItem.rate;
          }
          return updatedItem;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: "",
      hsnSac: "",
      quantity: "",
      rate: 0,
      per: "",
      amount: 0
    };
    setData(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== id) }));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      {/* Sidebar Editor */}
      <div className="w-full md:w-[450px] bg-white border-r border-slate-200 p-6 overflow-y-auto no-print max-h-screen">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-slate-900 p-2 rounded text-white font-black">LB</div>
          <h1 className="text-xl font-black tracking-tight uppercase">Labour Bill System</h1>
        </div>

        <section className="space-y-8 pb-20">
          {/* Seller Section */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Building2 size={14} /> Seller Information
            </h2>
            <div className="space-y-3">
              <input className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none font-bold" placeholder="Seller Name" name="name" value={data.seller.name} onChange={handleSellerChange} />
              <textarea className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none min-h-[60px]" placeholder="Seller Address" name="address" value={data.seller.address} onChange={handleSellerChange} />
              <div className="grid grid-cols-2 gap-3">
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none font-mono" placeholder="GSTIN" name="gstin" value={data.seller.gstin} onChange={handleSellerChange} />
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Email" name="email" value={data.seller.email} onChange={handleSellerChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="State Name" name="stateName" value={data.seller.stateName} onChange={handleSellerChange} />
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="State Code" name="stateCode" value={data.seller.stateCode} onChange={handleSellerChange} />
              </div>
            </div>
          </div>

          {/* Parties Section */}
          {(['consignee', 'buyer'] as const).map(party => (
            <div key={party}>
              <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                <User size={14} /> {party.charAt(0).toUpperCase() + party.slice(1)}
              </h2>
              <div className="space-y-3">
                <input className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none font-bold" placeholder="Name" name="name" value={data[party].name} onChange={(e) => handlePartyChange(party, e)} />
                <textarea className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none min-h-[60px]" placeholder="Address" name="address" value={data[party].address} onChange={(e) => handlePartyChange(party, e)} />
                <input className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none font-mono" placeholder="GSTIN" name="gstin" value={data[party].gstin} onChange={(e) => handlePartyChange(party, e)} />
                <div className="grid grid-cols-2 gap-3">
                  <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="State" name="stateName" value={data[party].stateName} onChange={(e) => handlePartyChange(party, e)} />
                  <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Code" name="stateCode" value={data[party].stateCode} onChange={(e) => handlePartyChange(party, e)} />
                </div>
              </div>
            </div>
          ))}

          {/* Invoice Info */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <FileText size={14} /> Invoice Details
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Inv No." name="invoiceNumber" value={data.invoice.invoiceNumber} onChange={handleInvoiceChange} />
              <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" type="date" name="date" value={data.invoice.date} onChange={handleInvoiceChange} />
              <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Delivery Note" name="deliveryNote" value={data.invoice.deliveryNote} onChange={handleInvoiceChange} />
              <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Payment Mode" name="paymentMode" value={data.invoice.paymentMode} onChange={handleInvoiceChange} />
              <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Ref No." name="referenceNo" value={data.invoice.referenceNo} onChange={handleInvoiceChange} />
              <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Other Ref" name="otherReferences" value={data.invoice.otherReferences} onChange={handleInvoiceChange} />
            </div>
          </div>

          {/* Shipping/Dispatch */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              Shipment Information
            </h2>
            <div className="grid grid-cols-1 gap-3">
              <div className="grid grid-cols-2 gap-3">
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Buyer Order No" name="buyersOrderNo" value={data.shipping.buyersOrderNo} onChange={handleShippingChange} />
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Order Date" name="orderDated" value={data.shipping.orderDated} onChange={handleShippingChange} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Dispatch Doc No" name="dispatchDocNo" value={data.shipping.dispatchDocNo} onChange={handleShippingChange} />
                <input className="px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Note Date" name="deliveryNoteDate" value={data.shipping.deliveryNoteDate} onChange={handleShippingChange} />
              </div>
              <input className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Dispatched Through" name="dispatchedThrough" value={data.shipping.dispatchedThrough} onChange={handleShippingChange} />
              <input className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Destination" name="destination" value={data.shipping.destination} onChange={handleShippingChange} />
              <textarea className="w-full px-3 py-2 border border-slate-200 text-sm focus:border-black outline-none" placeholder="Terms of Delivery" name="termsOfDelivery" value={data.shipping.termsOfDelivery} onChange={handleShippingChange} />
            </div>
          </div>

          {/* Items */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <Plus size={14} /> Bill Items
            </h2>
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {data.items.map((item) => (
                  <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="p-4 border border-slate-200 bg-slate-50 relative group">
                    <button onClick={() => removeItem(item.id)} className="absolute -top-2 -right-2 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"><Trash2 size={12} /></button>
                    <div className="space-y-2">
                      <input className="w-full bg-transparent border-b border-slate-300 text-sm focus:border-black outline-none font-bold" placeholder="Item Description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                      <div className="grid grid-cols-2 gap-2">
                        <input className="bg-transparent border-b border-slate-300 text-xs focus:border-black outline-none" placeholder="HSN/SAC" value={item.hsnSac} onChange={(e) => updateItem(item.id, 'hsnSac', e.target.value)} />
                        <input className="bg-transparent border-b border-slate-300 text-xs focus:border-black outline-none" placeholder="Per (kg/hrs...)" value={item.per} onChange={(e) => updateItem(item.id, 'per', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input className="bg-transparent border-b border-slate-300 text-xs focus:border-black outline-none" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} />
                        <input className="bg-transparent border-b border-slate-300 text-xs focus:border-black outline-none font-mono" placeholder="Rate" value={item.rate} onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button onClick={addItem} className="w-full py-2 border-2 border-dashed border-slate-300 rounded text-slate-400 font-bold text-xs hover:border-black hover:text-black transition-all">+ Add Service Item</button>
            </div>
          </div>

          {/* Tax */}
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
              <IndianRupee size={14} /> Tax Config (%)
            </h2>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-[8px] font-bold uppercase text-slate-400 flex mb-1">CGST</label><input type="number" className="w-full px-2 py-1 border border-slate-200 text-sm font-mono" name="cgstPercent" value={data.tax.cgstPercent} onChange={handleTaxChange} /></div>
              <div><label className="text-[8px] font-bold uppercase text-slate-400 flex mb-1">SGST</label><input type="number" className="w-full px-2 py-1 border border-slate-200 text-sm font-mono" name="sgstPercent" value={data.tax.sgstPercent} onChange={handleTaxChange} /></div>
              <div><label className="text-[8px] font-bold uppercase text-slate-400 flex mb-1">IGST</label><input type="number" className="w-full px-2 py-1 border border-slate-200 text-sm font-mono" name="igstPercent" value={data.tax.igstPercent} onChange={handleTaxChange} /></div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 left-0 w-full md:w-[450px] p-4 bg-white border-t border-slate-200 z-50 no-print flex gap-3">
          <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white py-3 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-black transition-all">
            <Printer size={18} /> Print
          </button>
          <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-3 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
            <IndianRupee size={18} /> Download PDF
          </button>
        </div>
      </div>

      {/* Preview Section */}
      <div className="flex-1 p-8 overflow-y-auto max-h-screen bg-slate-200">
        <div className="mx-auto bg-white shadow-xl min-h-[1123px] w-[794px] p-6 text-[11px] font-serif leading-tight border border-slate-300 flex flex-col invoice-container overflow-hidden">
          {/* Header */}
          <div className="text-center mb-4">
            <h1 className="text-lg font-black uppercase tracking-widest border-b-2 border-black inline-block px-4 pb-1">LABOUR BILL</h1>
          </div>

          {/* Top Section Grid */}
          <div className="grid grid-cols-2 border border-black h-[140px]">
            <div className="p-2 border-r border-black overflow-hidden">
              <h4 className="font-black mb-1">{data.seller.name}</h4>
              <p className="whitespace-pre-wrap">{data.seller.address}</p>
              <div className="mt-2 space-y-0.5">
                <p>GSTIN/UIN: <span className="font-bold">{data.seller.gstin}</span></p>
                <p>State Name: {data.seller.stateName}, Code: {data.seller.stateCode}</p>
                <p>E-Mail: {data.seller.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-4 h-full">
              <div className="p-1 border-b border-r border-black">Invoice No.<br/><span className="font-bold">{data.invoice.invoiceNumber}</span></div>
              <div className="p-1 border-b border-black">Dated<br/><span className="font-bold">{data.invoice.date}</span></div>
              <div className="p-1 border-b border-r border-black">Delivery Note<br/><span className="font-bold">{data.invoice.deliveryNote || ' '}</span></div>
              <div className="p-1 border-b border-black">Mode/Terms of Payment<br/><span className="font-bold">{data.invoice.paymentMode || ' '}</span></div>
              <div className="p-1 border-b border-r border-black">Reference No. & Date<br/><span className="font-bold">{data.invoice.referenceNo || ' '}</span></div>
              <div className="p-1 border-b border-black">Other References<br/><span className="font-bold">{data.invoice.otherReferences || ' '}</span></div>
              <div className="p-1 border-r border-black">{' '}</div>
              <div className="p-1">{' '}</div>
            </div>
          </div>

          {/* Consignee Section */}
          <div className="grid grid-cols-2 border-x border-b border-black min-h-[120px]">
            <div className="p-2 border-r border-black flex flex-col">
              <span className="text-[9px] font-bold">Consignee (Ship to)</span>
              <h4 className="font-black mt-1 leading-tight">{data.consignee.name}</h4>
              <p className="whitespace-pre-wrap mt-1 leading-normal">{data.consignee.address}</p>
              <div className="mt-auto pt-2 space-y-0.5">
                <p>GSTIN/UIN: <span className="font-bold">{data.consignee.gstin}</span></p>
                <p>State Name: {data.consignee.stateName}, Code: {data.consignee.stateCode}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 h-full">
              <div className="p-1 border-b border-r border-black">Buyer's Order No.<br/><span className="font-bold">{data.shipping.buyersOrderNo}</span></div>
              <div className="p-1 border-b border-black">Dated<br/><span className="font-bold">{data.shipping.orderDated}</span></div>
              <div className="p-1 border-b border-r border-black">Dispatch Doc No.<br/><span className="font-bold">{data.shipping.dispatchDocNo}</span></div>
              <div className="p-1 border-b border-black">Delivery Note Date<br/><span className="font-bold">{data.shipping.deliveryNoteDate}</span></div>
              <div className="p-1 border-r border-black">Dispatched through<br/><span className="font-bold">{data.shipping.dispatchedThrough}</span></div>
              <div className="p-1">Destination<br/><span className="font-bold">{data.shipping.destination}</span></div>
            </div>
          </div>

          {/* Buyer Section */}
          <div className="grid grid-cols-10 border-x border-b border-black min-h-[140px]">
            <div className="col-span-5 p-2 border-r border-black flex flex-col h-full overflow-hidden">
               <span className="text-[9px] font-bold">Buyer (Bill to)</span>
               <h4 className="font-black mt-1 leading-tight">{data.buyer.name}</h4>
               <p className="whitespace-pre-wrap mt-1 leading-normal">{data.buyer.address}</p>
               <div className="mt-auto pt-2 space-y-0.5">
                <p>GSTIN/UIN: <span className="font-bold">{data.buyer.gstin}</span></p>
                <p>State Name: {data.buyer.stateName}, Code: {data.buyer.stateCode}</p>
              </div>
            </div>
            <div className="col-span-5 p-2 flex flex-col h-full overflow-hidden">
                <span className="text-[9px] font-bold">Terms of Delivery</span>
                <p className="whitespace-pre-wrap mt-1 leading-normal">{data.shipping.termsOfDelivery}</p>
            </div>
          </div>

          {/* Table */}
          <div className="flex-grow flex flex-col border-x border-black relative">
            {/* Table Header */}
            <div className="flex border-b border-black text-center font-bold text-[10px]">
              <div className="border-r border-black w-8 py-1">Sl No.</div>
              <div className="border-r border-black flex-1 py-1">Particulars</div>
              <div className="border-r border-black w-14 py-1">HSN/SAC</div>
              <div className="border-r border-black w-12 py-1">Quantity</div>
              <div className="border-r border-black w-14 py-1">Rate</div>
              <div className="border-r border-black w-10 py-1">per</div>
              <div className="w-20 py-1">Amount</div>
            </div>

            {/* Table Body & Vertical Lines Container */}
            <div className="flex-grow relative overflow-hidden">
              {/* Background vertical lines */}
              <div className="absolute inset-0 pointer-events-none flex">
                <div className="border-r border-black w-8 h-full"></div>
                <div className="border-r border-black flex-1 h-full"></div>
                <div className="border-r border-black w-14 h-full"></div>
                <div className="border-r border-black w-12 h-full"></div>
                <div className="border-r border-black w-14 h-full"></div>
                <div className="border-r border-black w-10 h-full"></div>
                <div className="w-20 h-full"></div>
              </div>

              {/* Items Content */}
              <div className="relative z-10 min-h-full">
                {data.items.map((item, idx) => (
                  <div key={item.id} className="flex min-h-[140px] items-stretch">
                    <div className="w-8 text-center p-1">{idx + 1}</div>
                    <div className="flex-1 p-2 flex flex-col justify-between">
                       <div className="font-black uppercase leading-tight">{item.description}</div>
                       <div className="flex flex-col items-end">
                         {data.tax.igstPercent > 0 && <div className="font-black">IGST</div>}
                         {data.tax.cgstPercent > 0 && <div className="font-black">CGST</div>}
                         {data.tax.sgstPercent > 0 && <div className="font-black">SGST</div>}
                       </div>
                    </div>
                    <div className="w-14 text-center p-1 break-all">{item.hsnSac}</div>
                    <div className="w-12 text-center p-1">{item.quantity}</div>
                    <div className="w-14 text-right p-1 font-mono">{item.rate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                    <div className="w-10 text-center p-1">{item.per}</div>
                    <div className="w-20 text-right p-1 flex flex-col justify-between">
                      <div className="font-black">{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                      <div className="flex flex-col items-end">
                        {totals.igstAmount > 0 && <div>{totals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                        {totals.cgstAmount > 0 && <div>{totals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                        {totals.sgstAmount > 0 && <div>{totals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Row */}
            <div className="flex border-t border-black font-bold h-7 items-center bg-white relative z-20">
              <div className="border-r border-black w-8 h-full"></div>
              <div className="border-r border-black flex-1 h-full text-right pr-2 self-center pt-1">Total</div>
              <div className="border-r border-black w-14 h-full"></div>
              <div className="border-r border-black w-12 h-full"></div>
              <div className="border-r border-black w-14 h-full"></div>
              <div className="border-r border-black w-10 h-full"></div>
              <div className="w-20 text-right pr-1 flex items-center justify-end gap-1"><span className="text-[9px]">₹</span> {totals.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            </div>
          </div>

          {/* Summary Box */}
          <div className="border border-black p-2 flex flex-col min-h-[60px]">
             <div className="flex justify-between items-start">
               <div>
                <span className="italic">Amount Chargeable (in words)</span>
                <p className="font-black mt-1 uppercase text-xs">{totals.totalInWords}</p>
               </div>
               <span className="italic font-bold">E. & O.E</span>
             </div>
          </div>

          {/* Tax Table */}
          <div className="mt-2">
            <table className="w-full border border-black border-collapse text-center">
              <thead>
                <tr className="border-b border-black">
                  <th className="border-r border-black" rowSpan={2}>HSN/SAC</th>
                  <th className="border-r border-black" rowSpan={2}>Taxable Value</th>
                  {data.tax.igstPercent > 0 && <th className="border-r border-black" colSpan={2}>IGST</th>}
                  {(data.tax.cgstPercent > 0 || data.tax.sgstPercent > 0) && (
                    <><th className="border-r border-black" colSpan={2}>CGST</th><th className="border-r border-black" colSpan={2}>SGST</th></>
                  )}
                  <th rowSpan={2}>Total Tax Amount</th>
                </tr>
                <tr className="border-b border-black">
                   {(data.tax.cgstPercent > 0 || data.tax.sgstPercent > 0) ? (
                    <><th className="border-r border-black px-1">Rate</th><th className="border-r border-black">Amount</th><th className="border-r border-black px-1">Rate</th><th className="border-r border-black">Amount</th></>
                   ) : null}
                   {data.tax.igstPercent > 0 && <><th className="border-r border-black px-1">Rate</th><th className="border-r border-black">Amount</th></>}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-black">
                  <td className="border-r border-black">{data.items[0]?.hsnSac || '---'}</td>
                  <td className="border-r border-black px-1">{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  {data.tax.igstPercent > 0 && <><td className="px-1 border-r border-black">{data.tax.igstPercent}%</td><td className="px-1 border-r border-black">{totals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></>}
                  {data.tax.cgstPercent > 0 && <><td className="px-1 border-r border-black">{data.tax.cgstPercent}%</td><td className="px-1 border-r border-black">{totals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></>}
                  {data.tax.sgstPercent > 0 && <><td className="px-1 border-r border-black">{data.tax.sgstPercent}%</td><td className="px-1 border-r border-black">{totals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></>}
                  <td className="px-1">{totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
                <tr className="font-bold">
                  <td className="border-r border-black text-right pr-2">Total</td>
                  <td className="border-r border-black px-1">{totals.subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                  {data.tax.igstPercent > 0 && <><td className="border-r border-black"></td><td className="px-1 border-r border-black">{totals.igstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></>}
                  {data.tax.cgstPercent > 0 && <><td className="border-r border-black"></td><td className="px-1 border-r border-black">{totals.cgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></>}
                  {data.tax.sgstPercent > 0 && <><td className="border-r border-black"></td><td className="px-1 border-r border-black">{totals.sgstAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td></>}
                  <td className="px-1">{totals.totalTax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-2 text-xs">
            Tax Amount (in words) : <span className="font-black uppercase">{totals.taxInWords}</span>
          </div>

          {/* Footer Footer */}
          <div className="mt-auto pt-10 flex flex-col">
            <div className="self-end w-[250px] border border-black p-2 flex flex-col items-center">
                <span className="font-bold self-end text-[10px]">for {data.seller.name}</span>
                <div className="h-16"></div>
                <span className="text-[10px]">Authorised Signatory</span>
            </div>
            <div className="text-center mt-6">
              <p className="text-[10px]">This is a Computer Generated Invoice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
