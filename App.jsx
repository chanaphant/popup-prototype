import React, { useState, useEffect, useRef, useMemo } from 'react';
// -----------------------------------------------------
// 1. Import Lucide Icons ทั้งหมดเข้ามาใน Object ชื่อ 'LucideIcons'
import * as LucideIcons from 'lucide-react';
// 2. ดึง Icon ที่ต้องการออกมาจาก Object
const { 
  LayoutDashboard, Store, CalendarDays, Users, Package, Tag, Receipt, Settings, HelpCircle,
  Bell, Download, Upload, Search, MessageSquare, Clock, MoreHorizontal, ChevronRight,
  LogOut, Home, Menu, X, Scan, Plus, Minus, Trash2, Smartphone, FileText, CreditCard,
  Wallet, QrCode, History, Star, Zap, User, Scissors, Database, Contact, FileBarChart,
  CheckCircle2, Camera, Dog, Cat, Rabbit, Megaphone, MessageCircle, PawPrint, Filter,
  ChevronDown, Fish, Bird, Save, Code, HeartPulse, Activity, ShoppingCart, List, Grid,
  AlertCircle, AlertTriangle, Truck, FileInput, FileOutput, XCircle, ArrowLeft, ShoppingBasket, CheckSquare, Square
} = LucideIcons; // <--- โค้ดที่ดึง Icon ทั้งหมดที่คุณใช้

// ==========================================
// ZONE A: SSOT (Single Source of Truth)
// Mock Data, Constants, and Configs test
// ==========================================

const FONTS = {
  header: "font-['Prompt',_sans-serif]",
  body: "font-['Sarabun',_sans-serif]"
};

// --- SYSTEM DEFAULTS (NEW: For Manageability) ---
const SYSTEM_DEFAULTS = {
  shopName: 'Pet Omni Store',
  branch: 'สาขาหลัก (Main)',
  taxRate: 0.07, // 7%
  currency: 'THB',
  currencySymbol: '฿'
};

// --- DATA SETS ---

const PetProductsDB = [
  { id: 'P001', sku: 'D-001', barcode: '8851234567890', name: 'อาหารสุนัข สูตร 1', brand: 'Royal Canin', supplier: 'Royal Canin Thailand', category: 'Food', subCategory: 'Dry Food', stock: 150, stockPolicy: { min: 10, max: 50 }, unit: 'ถุง', price: 450, cost: 380, shelfLife: '90 วัน', animal: 'dog', img: '🐶' },
  { id: 'P002', sku: 'C-012', barcode: '8859876543210', name: 'ขนมแมวเลีย รสทูน่า', brand: 'Me-O', supplier: 'Perfect Companion', category: 'Food', subCategory: 'Snack', stock: 8, stockPolicy: { min: 20, max: 100 }, unit: 'ชิ้น', price: 25, cost: 18, shelfLife: '15 วัน', animal: 'cat', img: '🐱' },
  { id: 'P003', sku: 'S-005', barcode: '8854567890123', name: 'แชมพูสุนัข สูตรอ่อนโยน', brand: 'Generic', supplier: 'Pet Care Supply', category: 'Care', subCategory: 'Shampoo', stock: 0, stockPolicy: { min: 5, max: 30 }, unit: 'ขวด', price: 120, cost: 80, shelfLife: '-', animal: 'dog', img: '🧴' },
  { id: 'P004', sku: 'A-033', barcode: '8850011223344', name: 'ปลอกคอแมว นิรภัย', brand: 'Generic', supplier: 'Pet Accessories Co.', category: 'Accessory', subCategory: 'Collar', stock: 42, stockPolicy: { min: 10, max: 50 }, unit: 'ชิ้น', price: 89, cost: 40, shelfLife: '120+ วัน', animal: 'cat', img: '🎀' },
  { id: 'P005', sku: 'T-009', barcode: '8857788990011', name: 'ของเล่นสุนัข ยางกัด', brand: 'Kong', supplier: 'Global Pet Toys', category: 'Toy', subCategory: 'Chew Toy', stock: 25, stockPolicy: { min: 5, max: 20 }, unit: 'ชิ้น', price: 150, cost: 90, shelfLife: '75 วัน', animal: 'dog', img: '🦴' },
  { id: 'P006', sku: 'L-001', barcode: '8853344556677', name: 'ทรายแมว 5L กลิ่นมะนาว', brand: 'Kasty', supplier: 'Kasty Thailand', category: 'Care', subCategory: 'Litter', stock: 12, stockPolicy: { min: 10, max: 40 }, unit: 'ถุง', price: 180, cost: 120, shelfLife: '20 วัน', animal: 'cat', img: '🚽' },
  { id: 'P007', sku: 'F-101', barcode: '8859988776655', name: 'อาหารปลาทอง เร่งสี', brand: 'Sakura', supplier: 'Aqua Feed', category: 'Food', subCategory: 'Pellet', stock: 30, stockPolicy: { min: 10, max: 50 }, unit: 'ซอง', price: 60, cost: 35, shelfLife: '180 วัน', animal: 'fish', img: '🐟' },
  { id: 'P008', sku: 'R-202', barcode: '8852233445566', name: 'หญ้าแห้งกระต่าย Alfalfa', brand: 'Alfalfa King', supplier: 'Rabbit Lovers', category: 'Food', subCategory: 'Hay', stock: 10, stockPolicy: { min: 15, max: 60 }, unit: 'แพ็ค', price: 220, cost: 150, shelfLife: '60 วัน', animal: 'rabbit', img: '🐰' },
  { id: 'P009', sku: 'M-001', barcode: '8851122334455', name: 'Frontline Plus Dog (10-20kg)', brand: 'Frontline', supplier: 'Boehringer Ingelheim', category: 'Medicine', subCategory: 'Flea & Tick', stock: 18, stockPolicy: { min: 5, max: 20 }, unit: 'กล่อง', price: 890, cost: 600, shelfLife: '365 วัน', animal: 'dog', img: '💉' },
  { id: 'P010', sku: 'B-055', barcode: '8856677889900', name: 'เบาะนอนสุนัข นุ่มพิเศษ L', brand: 'Sleepy Pet', supplier: 'Pet Bed Factory', category: 'Accessory', subCategory: 'Bedding', stock: 5, stockPolicy: { min: 3, max: 15 }, unit: 'ชิ้น', price: 890, cost: 500, shelfLife: '-', animal: 'dog', img: '🛏️' },
];

const PetsDB = [
  { id: 'PET001', name: 'หมูตุ๋น', gender: 'Male', weight: 28.5, birthYear: 2020, type: 'dog', breed: 'Golden Retriever', chronicDiseases: ['โรคข้อสะโพก'], ownerName: 'คุณ สมชาย ใจดี', phone: '081-111-1111', lineId: '@somchai' },
  { id: 'PET002', name: 'มาร์นี่', gender: 'Female', weight: 4.2, birthYear: 2021, type: 'cat', breed: 'Persian', chronicDiseases: ['ทำหมันแล้ว'], ownerName: 'คุณ วิภา รักสัตว์', phone: '089-222-2222', lineId: '@vipa_cat' },
  { id: 'PET003', name: 'โอเลี้ยง', gender: 'Male', weight: 5.5, birthYear: 2019, type: 'dog', breed: 'Poodle', chronicDiseases: ['โรคผิวหนัง'], ownerName: 'คุณ บาส', phone: '083-456-7890', lineId: null },
  { id: 'PET004', name: 'สโนว์บอล', gender: 'Female', weight: 1.8, birthYear: 2022, type: 'rabbit', breed: 'Holland Lop', chronicDiseases: [], ownerName: 'คุณ จอย', phone: '088-901-2345', lineId: 'joy_rabbit' },
  { id: 'PET005', name: 'รถถัง', gender: 'Male', weight: 22.0, birthYear: 2018, type: 'dog', breed: 'Bulldog', chronicDiseases: ['โรคระบบทางเดินหายใจ', 'โรคหัวใจ'], ownerName: 'คุณ เอ', phone: '085-678-9012', lineId: 'mr_a' },
  { id: 'PET006', name: 'ศรีตรัง', gender: 'Female', weight: 3.5, birthYear: 2020, type: 'cat', breed: 'Siamese', chronicDiseases: ['ทำหมันแล้ว'], ownerName: 'คุณ แป้ง', phone: '084-567-8901', lineId: 'pang_jung' },
  { id: 'PET007', name: 'ริชชี่', gender: 'Male', weight: 0.05, birthYear: 2023, type: 'fish', breed: 'Goldfish', chronicDiseases: [], ownerName: 'คุณ มารวย', phone: '087-890-1234', lineId: 'rich_fish' },
  { id: 'PET008', name: 'เขียวหวาน', gender: 'Male', weight: 0.1, birthYear: 2021, type: 'bird', breed: 'Parrot', chronicDiseases: [], ownerName: 'คุณ จอย', phone: '088-901-2345', lineId: 'joy_rabbit' },
  { id: 'PET009', name: 'ตัวเล็ก', gender: 'Female', weight: 2.5, birthYear: 2017, type: 'dog', breed: 'Chihuahua', chronicDiseases: ['โรคหัวใจ'], ownerName: 'คุณ สมชาย ใจดี', phone: '081-111-1111', lineId: '@somchai' },
  { id: 'PET010', name: 'ลูน่า', gender: 'Female', weight: 4.0, birthYear: 2022, type: 'cat', breed: 'Scottish Fold', chronicDiseases: ['นิ่ว'], ownerName: 'คุณ วิภา รักสัตว์', phone: '089-222-2222', lineId: '@vipa_cat' },
];

const INITIAL_MEMBERS_DB = [
  { id: '0812345678', name: 'คุณ สมศรี รักสัตว์', phone: '081-234-5678', level: 'ก๊วนเพื่อนซี้', levelColor: 'bg-purple-100 text-purple-600', points: 1325, pets: ['dog'], line: true, theme: 'amber', visits: 1 },
  { id: '0823456789', name: 'คุณ บี', phone: '082-345-6789', level: 'ครอบครัวขนฟู', levelColor: 'bg-green-100 text-green-600', points: 8536, pets: ['dog', 'cat', 'rabbit'], line: true, theme: 'purple', visits: 5 },
  { id: '0834567890', name: 'คุณ บาส', phone: '083-456-7890', level: 'คู่หูขนฟู', levelColor: 'bg-blue-100 text-blue-600', points: 9988, pets: ['dog'], line: true, theme: 'blue', visits: 8 },
  { id: '0845678901', name: 'คุณ แป้ง', phone: '084-567-8901', level: 'คู่หูขนฟู', levelColor: 'bg-blue-100 text-blue-600', points: 8988, pets: ['cat'], line: true, theme: 'pink', visits: 12 },
  { id: '0856789012', name: 'คุณ เอ', phone: '085-678-9012', level: 'คู่หูขนฟู', levelColor: 'bg-blue-100 text-blue-600', points: 9033, pets: ['dog', 'cat'], line: true, theme: 'indigo', visits: 3 },
  { id: '0878901234', name: 'คุณ มารวย', phone: '087-890-1234', level: 'ผู้พิทักษ์', levelColor: 'bg-gray-100 text-gray-600', points: 250, pets: ['fish'], line: true, theme: 'amber', visits: 0 },
  { id: '0889012345', name: 'คุณ จอย', phone: '088-901-2345', level: 'ก๊วนเพื่อนซี้', levelColor: 'bg-purple-100 text-purple-600', points: 500, pets: ['bird'], line: false, theme: 'green', visits: 2 },
];

const INITIAL_CART_ITEMS = [
  { id: 1, name: 'Royal Canin Maxi Adult อาหารสุนัขพันธุ์ใหญ่', price: 2200, discount: 220, stock: 25, promo: '10% OFF', qty: 1, unit: 'ถุง', code: 'RC' },
  { id: 2, name: 'Me-O Cat Food Tuna อาหารแมวรสทูน่า', price: 450, discount: 0, stock: 15, promo: null, qty: 2, unit: 'ถุง', code: 'Me-O' },
  { id: 3, name: 'SmartHeart Power Pack อาหารสุนัขพลังงานสูง', price: 1500, discount: 0, stock: 8, promo: null, qty: 1, unit: 'ถุง', code: 'SH' },
];

const RECOMMENDED_ITEMS = [
  { id: 101, name: 'Royal Canin Maxi Adult', price: 2200, code: 'RC' },
  { id: 102, name: 'Me-O Cat Food Tuna', price: 450, code: 'Me-O' },
  { id: 103, name: 'SmartHeart Power Pack', price: 1500, code: 'SH' },
  { id: 104, name: 'เบาะนอนสุนัข นุ่มพิเศษ', price: 890, code: 'BED' },
  { id: 105, name: 'แชมพูกำจัดเห็บหมัด', price: 350, code: 'SHA' },
];

const DRAWER_MENU_ITEMS = [
  { id: 'home', title: 'หน้าหลัก', icon: Home },
  { id: 'dashboard', title: 'แดชบอร์ด', icon: LayoutDashboard },
  { id: 'pos', title: 'POS ขายหน้าร้าน', icon: Store },
  { id: 'booking', title: 'การจอง', icon: CalendarDays },
  { id: 'crm', title: 'สมาชิก CRM', icon: Users },
  { id: 'purchasing', title: 'ซื้อสินค้า', icon: Package },
  { id: 'promo', title: 'โปรโมชั่น', icon: Tag },
  { id: 'expenses', title: 'ค่าใช้จ่าย', icon: Receipt },
  { id: 'help', title: 'ศูนย์ช่วยเหลือ', icon: HelpCircle },
  { id: 'master', title: 'Master Data', icon: Database },
  { id: 'contacts', title: 'รายชื่อผู้ติดต่อ', icon: Contact },
  { id: 'reports', title: 'รายงาน', icon: FileBarChart },
  { id: 'settings', title: 'ตั้งค่าร้าน', icon: Settings },
];

const MAIN_MENUS = [
  { id: 'dashboard', title: 'แดชบอร์ด', icon: LayoutDashboard, color: 'bg-[#2A3B55]', hover: 'hover:bg-[#354a6b]', accent: 'text-blue-300' },
  { id: 'pos', title: 'POS ขายหน้าร้าน', icon: Store, color: 'bg-[#3B3068]', hover: 'hover:bg-[#4a3d82]', accent: 'text-purple-300' },
  { id: 'booking', title: 'การจอง', icon: CalendarDays, color: 'bg-[#065F46]', hover: 'hover:bg-[#087556]', accent: 'text-emerald-300' },
  { id: 'crm', title: 'สมาชิก CRM', icon: Users, color: 'bg-[#026AA7]', hover: 'hover:bg-[#037cc2]', accent: 'text-sky-300' },
  { id: 'purchasing', title: 'ซื้อสินค้า', icon: Package, color: 'bg-[#0F766E]', hover: 'hover:bg-[#138f85]', accent: 'text-teal-300' },
  { id: 'promo', title: 'โปรโมชั่น', icon: Tag, color: 'bg-[#BE123C]', hover: 'hover:bg-[#db1848]', accent: 'text-rose-300' },
  { id: 'expenses', title: 'ค่าใช้จ่าย', icon: Receipt, color: 'bg-[#15803D]', hover: 'hover:bg-[#199448]', accent: 'text-green-300' },
  { id: 'settings', title: 'ตั้งค่าร้าน', icon: Settings, color: 'bg-[#374151]', hover: 'hover:bg-[#4b5563]', accent: 'text-gray-300' },
  { id: 'help', title: 'ศูนย์ช่วยเหลือ', icon: HelpCircle, color: 'bg-[#C2410C]', hover: 'hover:bg-[#e04f12]', accent: 'text-orange-300' },
];

const PET_FILTER_BUTTONS = [
    { type: 'dog', icon: '🐶' },
    { type: 'cat', icon: '🐱' },
    { type: 'rabbit', icon: '🐰' },
    { type: 'bird', icon: '🦜' },
    { type: 'fish', icon: '🐟' }
];

const PURCHASING_ANIMAL_FILTERS = [
    { type: 'dog', icon: '🐶' },
    { type: 'cat', icon: '🐱' },
    { type: 'rabbit', icon: '🐰' },
    { type: 'hamster', icon: '🐹' },
    { type: 'bird', icon: '🦜' },
    { type: 'fish', icon: '🐟' },
    { type: 'turtle', icon: '🐢' },
    { type: 'lizard', icon: '🦎' },
];

const MEMBER_LEVEL_OPTIONS = ['ทั้งหมด', 'ก๊วนเพื่อนซี้', 'ครอบครัวขนฟู', 'คู่หูขนฟู', 'ผู้พิทักษ์'];

// ==========================================
// ZONE E: SUB-COMPONENTS (Pure Presentation)
// Presentation Logic Only (รับ Props มาแสดงผล)
// ==========================================

const SalesChart = () => (
    <div className="bg-[#1E1E24] rounded-3xl p-6 shadow-lg h-full flex flex-col justify-between">
      <div className="flex justify-between items-start"><div><h3 className={`${FONTS.header} text-gray-400 text-sm`}>ยอดขายรายสัปดาห์</h3><div className="flex items-center gap-2 mt-1"><span className={`${FONTS.header} text-3xl font-bold text-white`}>฿12,450.75</span><span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full flex items-center">↗ 75%</span></div></div></div>
      <div className="flex items-end justify-between gap-2 h-40 mt-6">{['จ','อ','พ','พฤ','ศ','ส','อา'].map((day, i) => { const heights = ['h-12', 'h-20', 'h-16', 'h-32', 'h-24', 'h-10', 'h-28']; const colors = ['bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500', 'bg-amber-400', 'bg-amber-400', 'bg-emerald-500', 'bg-emerald-500']; return (<div key={i} className="flex flex-col items-center gap-2 w-full"><div className={`w-full rounded-t-lg ${heights[i]} ${colors[i]} opacity-90 transition-all hover:opacity-100`}></div><span className={`${FONTS.body} text-gray-500 text-xs`}>{day}</span></div>); })}</div>
    </div>
);

const ServiceQueue = () => (
    <div className="bg-[#1E1E24] rounded-3xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4"><Store className="text-gray-400 w-5 h-5" /><h3 className={`${FONTS.header} text-white text-lg`}>คิวบริการ</h3></div>
      <div className="grid grid-cols-3 gap-3 mb-6">{[{ label: 'อาบน้ำ', count: 5, color: 'text-orange-500', badge: 2 }, { label: 'แพทย์', count: 2, color: 'text-blue-500', badge: 0 }, { label: 'โรงแรม', count: 8, color: 'text-purple-500', badge: 1 }].map((item, i) => (<div key={i} className="bg-[#2A2A32] rounded-2xl p-3 flex flex-col items-center relative cursor-pointer hover:bg-[#32323c] transition">{item.badge > 0 && (<div className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#1E1E24]">{item.badge}</div>)}<span className={`${FONTS.header} text-2xl font-bold ${item.color}`}>{item.count}</span><span className={`${FONTS.body} text-gray-400 text-xs mt-1`}>{item.label}</span></div>))}</div>
      <div className="space-y-3 mt-auto"><div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className={`${FONTS.body} text-gray-300`}>รอคิว</span></div><span className="text-white font-bold">4</span></div><div className="flex justify-between items-center text-sm"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className={`${FONTS.body} text-gray-300`}>ให้บริการ</span></div><span className="text-white font-bold">2</span></div></div>
    </div>
  );

const OrderList = () => (
    <div className="bg-[#1E1E24] rounded-3xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><Package className="text-gray-400 w-5 h-5" /><h3 className={`${FONTS.header} text-white text-lg`}>ออเดอร์ออนไลน์</h3></div><span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">12 ใหม่</span></div>
      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">{[{ id: '#5821', name: 'คุณสมชาย', status: 'จัดส่งแล้ว', color: 'bg-green-500/20 text-green-400' }, { id: '#5820', name: 'คุณวิภา', status: 'รอชำระเงิน', color: 'bg-yellow-500/20 text-yellow-400' }, { id: '#5819', name: 'คุณมานี', status: 'กำลังเตรียม', color: 'bg-blue-500/20 text-blue-400' }, { id: '#5818', name: 'คุณอาทิตย์', status: 'ยกเลิก', color: 'bg-red-500/20 text-red-400' }, { id: '#5817', name: 'คุณปิติ', status: 'จัดส่งแล้ว', color: 'bg-green-500/20 text-green-400' }].map((order, i) => (<div key={i} className="bg-[#2A2A32] p-4 rounded-xl flex justify-between items-center hover:bg-[#32323c] transition cursor-pointer"><div><div className={`${FONTS.header} text-white font-bold`}>Order {order.id}</div><div className={`${FONTS.body} text-gray-400 text-sm`}>{order.name}</div></div><span className={`${FONTS.body} text-xs px-3 py-1 rounded-lg ${order.color}`}>{order.status}</span></div>))}</div>
    </div>
);

const MessageBox = () => (
    <div className="bg-[#1E1E24] rounded-3xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-center mb-4"><div className="flex items-center gap-2"><MessageSquare className="text-gray-400 w-5 h-5" /><h3 className={`${FONTS.header} text-white text-lg`}>กล่องข้อความ</h3></div><span className={`${FONTS.body} text-gray-500 text-xs cursor-pointer hover:text-white`}>ดูทั้งหมด</span></div>
      <div className="space-y-4">{[{ name: 'คุณสมศรี', msg: 'สอบถามเรื่องฝากเลี้ยงน้องแมวค่ะ', time: '10:30', active: true }, { name: 'คุณเดชา', msg: 'อยากจองคิวตัดขนสุนัข...', time: '09:15', active: true }, { name: 'คุณปิติ', msg: 'ขอบคุณสำหรับบริการครับ', time: 'เมื่อวาน', active: false }].map((msg, i) => (<div key={i} className={`flex gap-3 items-start pb-3 ${i !== 2 ? 'border-b border-gray-700' : ''}`}><div className={`w-2 h-full rounded-full mt-2 ${msg.active ? 'bg-rose-500' : 'bg-transparent'}`}></div><div className="flex-1"><div className="flex justify-between"><span className={`${FONTS.header} text-white font-medium`}>{msg.name}</span><span className={`${FONTS.body} text-gray-600 text-xs`}>{msg.time}</span></div><p className={`${FONTS.body} text-gray-400 text-sm truncate w-40`}>{msg.msg}</p></div></div>))}</div>
    </div>
);

const MainMenuGrid = ({ onNavigate }) => (
    <div className="h-full flex flex-col">
       <div className="flex items-center gap-2 mb-4"><LayoutDashboard className="text-purple-400 w-6 h-6" /><h2 className={`${FONTS.header} text-white text-xl font-bold`}>เมนูหลัก</h2></div>
       <div className="grid grid-cols-3 gap-4 flex-1">{MAIN_MENUS.map((menu) => (<button key={menu.id} onClick={() => onNavigate(menu.id)} className={`${menu.color} ${menu.hover} rounded-3xl p-6 flex flex-col justify-center items-center gap-4 transition-all duration-300 transform hover:scale-[1.02] shadow-xl group`}><div className={`p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors`}><menu.icon size={40} className="text-white" /></div><span className={`${FONTS.header} text-white text-xl font-bold tracking-wide`}>{menu.title}</span></button>))}</div>
    </div>
);

const MemberSearchPopup = ({ isOpen, onClose, members, onSelectMember, onOpenNewMember }) => {
    const [searchTerm, setSearchTerm] = useState('');
    if (!isOpen) return null;
    const filtered = members.filter(m => m.name.includes(searchTerm) || m.phone.includes(searchTerm));

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <div><h3 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ค้นหาสมาชิก</h3><p className={`${FONTS.body} text-sm text-gray-500`}>กรอกชื่อ หรือ เบอร์โทรศัพท์</p></div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X size={24} /></button>
                </div>
                <div className="p-6 pb-2"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" autoFocus placeholder="ค้นหาชื่อ, เบอร์โทร..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-lg`} /></div></div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {filtered.length > 0 ? (
                        <div className="space-y-2">{filtered.map(member => (
                                <div key={member.id} onClick={() => onSelectMember(member)} className="p-4 rounded-xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition flex items-center justify-between group">
                                    <div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${member.theme === 'amber' ? 'bg-amber-400' : member.theme === 'purple' ? 'bg-purple-500' : member.theme === 'gray' ? 'bg-gray-400' : 'bg-slate-400'}`}>{member.name.charAt(4)}</div><div><h4 className={`${FONTS.header} font-bold text-gray-800`}>{member.name}</h4><p className={`${FONTS.body} text-sm text-gray-500 flex items-center gap-1`}><Smartphone size={12} /> {member.phone}</p></div></div>
                                    <div className="text-right"><span className={`text-xs px-2 py-1 rounded-full font-bold ${member.levelColor || 'bg-gray-100 text-gray-600'}`}>{member.level}</span><p className="text-emerald-600 text-sm font-bold mt-1">{member.points.toLocaleString()} pts</p></div>
                                </div>
                            ))}</div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-gray-400"><User size={48} className="mb-2 opacity-20" /><p>ไม่พบรายชื่อสมาชิก</p><button onClick={() => {onClose(); onOpenNewMember();}} className="mt-4 text-emerald-600 font-bold hover:underline">+ เพิ่มสมาชิกใหม่</button></div>
                    )}
                </div>
            </div>
        </div>
    );
};

const NewMemberPopup = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({ phone: '', nickname: '', lineId: '', dogs: 0, cats: 0, rabbits: 0 });
    if (!isOpen) return null;
    const handleCounter = (type, op) => { setFormData(prev => ({ ...prev, [type]: op === 'inc' ? prev[type] + 1 : Math.max(0, prev[type] - 1) })); };

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-emerald-600 p-6 text-white flex justify-between items-start">
                    <div><h3 className={`${FONTS.header} text-2xl font-bold`}>สมาชิกใหม่</h3><p className={`${FONTS.body} text-emerald-100 text-sm opacity-90`}>กรอกข้อมูลเพื่อสมัครสมาชิกด่วน</p></div>
                    <button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"><X size={20} /></button>
                </div>
                <div className="p-6 space-y-5">
                    <div className="space-y-4">
                        <div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-1 block`}>เบอร์โทรศัพท์ (ใช้เป็น Member ID)</label><div className="relative"><Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" className={`${FONTS.header} w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition font-bold text-lg text-gray-800 tracking-wide`} placeholder="0XX-XXX-XXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div></div>
                        <div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-1 block`}>ชื่อเล่นลูกค้า</label><input type="text" className={`${FONTS.header} w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition`} placeholder="เช่น คุณเมย์, น้องจอย" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} /></div>
                    </div>
                    <div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-2 block`}>จำนวนน้องๆ ที่เลี้ยง</label><div className="grid grid-cols-3 gap-3">{[{ id: 'dogs', label: 'สุนัข', icon: '🐶', color: 'bg-orange-50 border-orange-200 text-orange-600' }, { id: 'cats', label: 'แมว', icon: '🐱', color: 'bg-blue-50 border-blue-200 text-blue-600' }, { id: 'rabbits', label: 'กระต่าย', icon: '🐰', color: 'bg-pink-50 border-pink-200 text-pink-600' }].map(pet => (<div key={pet.id} className={`flex flex-col items-center p-2 rounded-xl border ${pet.color} transition-all`}><span className="text-2xl mb-1">{pet.icon}</span><span className={`${FONTS.header} text-xs font-bold mb-2`}>{pet.label}</span><div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-black/5 px-1 py-1"><button onClick={() => handleCounter(pet.id, 'dec')} className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 transition">-</button><span className="font-bold text-gray-800 w-4 text-center text-sm">{formData[pet.id]}</span><button onClick={() => handleCounter(pet.id, 'inc')} className="w-6 h-6 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 transition">+</button></div></div>))}</div></div>
                </div>
                <div className="p-6 pt-0 flex gap-3"><button onClick={onClose} className={`${FONTS.header} flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition`}>ยกเลิก</button><button onClick={() => {alert('Added!'); onClose();}} className={`${FONTS.header} flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition active:scale-95`}>+ เพิ่มสมาชิก</button></div>
            </div>
        </div>
    );
};

const GlobalDrawer = ({ isOpen, onClose, currentView, onNavigate }) => {
    return (
      <>
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={onClose}></div>
        <div className={`fixed top-0 left-0 h-full w-80 bg-[#1E1E24] shadow-2xl z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 pb-2">
            <div className="flex justify-between items-center mb-6"><h2 className={`${FONTS.header} text-2xl font-bold text-white tracking-widest`}>POP UP</h2><button onClick={onClose} className="text-gray-400 hover:text-white transition"><X size={24} /></button></div>
            <div className="mb-6"><div className="flex justify-between items-start text-gray-300 mb-2"><div><p className={`${FONTS.body} text-xs text-gray-500`}>Username :</p><p className={`${FONTS.header} font-bold text-white`}>JOB</p></div><LogOut size={18} className="text-gray-500 hover:text-red-400 cursor-pointer" /></div><div className="flex items-center gap-2"><p className={`${FONTS.body} text-xs text-gray-500`}>Access Level:</p><p className={`${FONTS.body} text-xs text-green-400`}>demo</p></div></div>
            <button className={`${FONTS.header} w-full bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900 font-bold py-3 rounded-xl mb-4 transition shadow-lg shadow-amber-900/20`}>เครื่องหลัก</button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 pb-6 custom-scrollbar">
             <div className="space-y-1">
                {DRAWER_MENU_ITEMS.map((item) => {
                   const isActive = currentView === item.id;
                   return (
                     <button key={item.id} onClick={() => onNavigate(item.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-[#FCD34D] text-gray-900 shadow-md' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-gray-500 group-hover:text-white'} />
                        <span className={`${FONTS.header} font-medium text-sm`}>{item.title}</span>
                     </button>
                   );
                })}
             </div>
          </div>
        </div>
      </>
    );
};

// --- Refactored Sidebars for Zone E ---

const POSSidebar = ({ onOpenDrawer, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const menuItems = [
    { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, highlight: true },
    { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
    { icon: Store, label: 'ระบบขายหน้าร้าน', active: true },
    { icon: Users, label: 'ลูกค้า & CRM' },
    { icon: Package, label: 'คลังสินค้า' },
    { icon: FileText, label: 'ประวัติบิล' },
    { icon: Receipt, label: 'ลิ้นชักเก็บเงิน' },
    { icon: Smartphone, label: 'พนักงานมือถือ' },
    { icon: CalendarDays, label: 'ตารางนัดหมาย' },
    { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
  ];
  return (
    <div className={`bg-white h-full shadow-xl z-40 transition-all duration-300 flex flex-col border-r border-gray-100 ${isExpanded ? 'w-64' : 'w-20'}`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
      <div className="flex flex-col h-full py-4">{menuItems.map((item, index) => (<div key={index} onClick={item.action} className={`relative flex items-center px-6 py-4 cursor-pointer transition-colors duration-200 ${item.active ? 'bg-emerald-50 text-emerald-600 border-l-4 border-emerald-500' : ''} ${!item.active && !item.highlight ? 'text-gray-400 hover:bg-gray-50 hover:text-emerald-500' : ''} ${item.highlight ? 'text-gray-800 hover:bg-gray-100' : ''} ${item.bottom ? 'mt-auto' : ''}`}><item.icon size={24} strokeWidth={item.active ? 2.5 : 2} className={item.highlight ? 'text-gray-800' : ''} />{item.badge && !isExpanded && (<span className="absolute top-2 right-4 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>)}<span className={`ml-4 ${FONTS.header} font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>{item.label}</span>{item.badge && isExpanded && (<span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>)}</div>))}</div>
    </div>
  );
};

const CRMSidebar = ({ onOpenDrawer, onNavigate, activeTab, onTabChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, highlight: true },
      { icon: Bell, label: 'การแจ้งเตือน', badge: 2 },
      { icon: Users, label: 'สมาชิก', id: 'members', action: () => onTabChange('members') },
      { icon: PawPrint, label: 'สัตว์เลี้ยง', id: 'pets', action: () => onTabChange('pets') },
      { icon: Settings, label: 'ตั้งค่า' },
      { icon: MessageCircle, label: 'Line OA' },
      { icon: Megaphone, label: 'BroadCast' },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return (
        <div className={`bg-white h-full shadow-xl z-40 transition-all duration-300 flex flex-col border-r border-gray-100 ${isExpanded ? 'w-64' : 'w-20'}`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
            <div className="flex flex-col h-full py-4">
                {menuItems.map((item, index) => (
                    <div key={index} onClick={item.action} className={`relative flex items-center px-6 py-4 cursor-pointer transition-colors duration-200 ${activeTab === item.id ? 'bg-[#FCD34D]/20 border-l-4 border-[#FCD34D] text-gray-900' : ''} ${activeTab !== item.id && !item.highlight ? 'text-gray-400 hover:bg-gray-50 hover:text-[#FCD34D]' : ''} ${item.highlight ? 'text-gray-800 hover:bg-gray-100' : ''} ${item.bottom ? 'mt-auto' : ''}`}>
                        <item.icon size={24} strokeWidth={activeTab === item.id ? 2.5 : 2} className={activeTab === item.id ? 'text-yellow-600' : (item.highlight ? 'text-gray-800' : '')} />
                        {item.badge && !isExpanded && (<span className="absolute top-2 right-4 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>)}
                        <span className={`ml-4 ${FONTS.header} font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'} ${activeTab === item.id ? 'text-gray-900 font-bold' : ''}`}>{item.label}</span>
                        {item.badge && isExpanded && (<span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

const PurchasingSidebar = ({ onOpenDrawer, onNavigate, activePage, onChangePage }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, highlight: true },
      { icon: Bell, label: 'การแจ้งเตือน', badge: 5 },
      { icon: LayoutDashboard, label: 'ภาพรวม', id: 'overview', active: true, action: () => onChangePage('overview') }, 
      { icon: Store, label: 'Marketplace' },
      { icon: ShoppingCart, label: 'ตะกร้า', id: 'cart', action: () => onChangePage('cart') },
      { icon: FileInput, label: 'ใบสั่งซื้อ' },
      { icon: Truck, label: 'ใบรับ' },
      { icon: CreditCard, label: 'ชำระเงิน' },
      { icon: Receipt, label: 'ใบเสร็จ' },
      { icon: XCircle, label: 'รายการยกเลิก' },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return (
        <div className={`bg-white h-full shadow-xl z-40 transition-all duration-300 flex flex-col border-r border-gray-100 ${isExpanded ? 'w-64' : 'w-20'}`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
            <div className="flex flex-col h-full py-4">
                {menuItems.map((item, index) => (
                    <div key={index} onClick={item.action} className={`relative flex items-center px-6 py-4 cursor-pointer transition-colors duration-200 ${activePage === item.id ? 'bg-[#FCD34D]/20 border-l-4 border-[#FCD34D] text-gray-900' : ''} ${activePage !== item.id && !item.highlight ? 'text-gray-400 hover:bg-gray-50 hover:text-[#FCD34D]' : ''} ${item.highlight ? 'text-gray-800 hover:bg-gray-100' : ''} ${item.bottom ? 'mt-auto' : ''}`}>
                        <item.icon size={24} strokeWidth={activePage === item.id ? 2.5 : 2} className={activePage === item.id ? 'text-yellow-600' : (item.highlight ? 'text-gray-800' : '')} />
                        {item.badge && !isExpanded && (<span className="absolute top-2 right-4 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>)}
                        <span className={`ml-4 ${FONTS.header} font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'} ${activePage === item.id ? 'text-gray-900 font-bold' : ''}`}>{item.label}</span>
                        {item.badge && isExpanded && (<span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>)}
                    </div>
                ))}
            </div>
        </div>
    );
};

const SettingsSidebar = ({ onOpenDrawer, onNavigate, activePage, onChangePage }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, highlight: true },
      { icon: Settings, label: 'ทั่วไป', id: 'general', active: true, action: () => onChangePage('general') },
      { icon: Users, label: 'ผู้ใช้งาน' },
      { icon: Database, label: 'จัดการข้อมูล' },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return (
        <div className={`bg-white h-full shadow-xl z-40 transition-all duration-300 flex flex-col border-r border-gray-100 ${isExpanded ? 'w-64' : 'w-20'}`} onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}>
            <div className="flex flex-col h-full py-4">
                {menuItems.map((item, index) => (
                    <div key={index} onClick={item.action} className={`relative flex items-center px-6 py-4 cursor-pointer transition-colors duration-200 ${activePage === item.id ? 'bg-[#FCD34D]/20 border-l-4 border-[#FCD34D] text-gray-900' : ''} ${activePage !== item.id && !item.highlight ? 'text-gray-400 hover:bg-gray-50 hover:text-[#FCD34D]' : ''} ${item.highlight ? 'text-gray-800 hover:bg-gray-100' : ''} ${item.bottom ? 'mt-auto' : ''}`}>
                        <item.icon size={24} strokeWidth={activePage === item.id ? 2.5 : 2} className={activePage === item.id ? 'text-yellow-600' : (item.highlight ? 'text-gray-800' : '')} />
                        <span className={`ml-4 ${FONTS.header} font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'} ${activePage === item.id ? 'text-gray-900 font-bold' : ''}`}>{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CartView = ({ items, onUpdateQty, onRemove, onSelect, selectedItems, onSelectAll }) => {
    // Group items by supplier
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.supplier]) acc[item.supplier] = [];
        acc[item.supplier].push(item);
        return acc;
    }, {});

    const totalSelected = items.filter(i => selectedItems.has(i.id)).reduce((sum, i) => sum + (i.cost * i.qty), 0);
    const allSelected = items.length > 0 && selectedItems.size === items.length;

    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-24">
                {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([supplier, supplierItems]) => {
                    const isSupplierAllSelected = supplierItems.every(i => selectedItems.has(i.id));
                    return (
                        <div key={supplier} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={() => {
                                            const ids = supplierItems.map(i => i.id);
                                            onSelect(ids, !isSupplierAllSelected);
                                        }}
                                        className={`w-5 h-5 rounded border flex items-center justify-center transition ${isSupplierAllSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-transparent'}`}
                                    >
                                        <CheckSquare size={14} />
                                    </button>
                                    <h3 className="font-bold text-gray-800">{supplier}</h3>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500">วิธีชำระเงิน:</span>
                                    <select className="text-xs border border-gray-200 rounded-lg px-2 py-1 outline-none focus:border-emerald-500 bg-white">
                                        <option>โอนเงิน</option>
                                        <option>บัตรเครดิต</option>
                                        <option>เช็ค</option>
                                    </select>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-50">
                                {supplierItems.map(item => (
                                    <div key={item.id} className="p-4 flex gap-4 items-center hover:bg-gray-50 transition group">
                                        <button 
                                            onClick={() => onSelect([item.id], !selectedItems.has(item.id))}
                                            className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition ${selectedItems.has(item.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-transparent'}`}
                                        >
                                            <CheckSquare size={14} />
                                        </button>
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 border border-gray-200">
                                            {item.img || '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{item.name}</h4>
                                                    <p className="text-xs text-gray-500">{item.brand}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-emerald-600">฿{(item.cost * item.qty).toLocaleString()}</p>
                                                    <p className="text-xs text-gray-400">@{item.cost}</p>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-end mt-2">
                                                <div className="text-xs text-gray-400 font-mono">{item.sku}</div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg h-8">
                                                        <button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-l-lg transition"><Minus size={14} /></button>
                                                        <input 
                                                            type="text" 
                                                            value={item.qty} 
                                                            onChange={(e) => {
                                                                const val = parseInt(e.target.value);
                                                                if (!isNaN(val) && val > 0) onUpdateQty(item.id, val);
                                                            }}
                                                            className="w-12 text-center text-sm font-bold text-gray-700 outline-none" 
                                                        />
                                                        <button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-r-lg transition"><Plus size={14} /></button>
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-medium">{item.unit}</div>
                                                    <button onClick={() => onRemove(item.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition ml-2">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <ShoppingBasket size={64} className="mb-4 opacity-20" />
                        <p className="text-lg font-medium">ตะกร้าว่างเปล่า</p>
                        <p className="text-sm">เลือกสินค้าจากภาพรวมเพื่อเริ่มสั่งซื้อ</p>
                    </div>
                )}
            </div>
            
            {/* Footer Bar */}
            <div className="h-20 bg-white border-t border-gray-200 px-8 flex items-center justify-between shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => onSelectAll(!allSelected)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition ${allSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 text-transparent'}`}
                    >
                        <CheckSquare size={14} />
                    </button>
                    <span className="text-gray-600 font-medium">เลือกทั้งหมด ({items.length})</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-gray-500">ยอดรวมสุทธิ</p>
                        <p className="text-2xl font-bold text-emerald-600">฿{totalSelected.toLocaleString()}</p>
                    </div>
                    <button className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg transition transform active:scale-95 flex items-center gap-2 ${totalSelected > 0 ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-200' : 'bg-gray-300 cursor-not-allowed'}`}>
                        สั่งซื้อสินค้า <ArrowLeft className="rotate-180" size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const PurchasingModule = ({ 
    products, 
    handleNavigate, 
    setIsDrawerOpen,
    purchaseRequestItems,
    addToPurchaseRequest
}) => {
    const [activePage, setActivePage] = useState('overview'); 
    const [activeTab, setActiveTab] = useState('ทั้งหมด');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); 
    
    // Filters State
    const [filters, setFilters] = useState({ supplier: 'all', brand: 'all', category: 'all', subCategory: 'all', animal: 'all' });
    const [filterDropdowns, setFilterDropdowns] = useState({ supplier: false, brand: false, category: false, subCategory: false });
    const dropdownRef = useRef(null);

    // Cart Selection State
    const [selectedItems, setSelectedItems] = useState(new Set());

    // Close dropdowns on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setFilterDropdowns({ supplier: false, brand: false, category: false, subCategory: false });
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef]);

    // Unique values for dropdowns
    const uniqueSuppliers = [...new Set(products.map(p => p.supplier))];
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    const uniqueSubCategories = [...new Set(products.map(p => p.subCategory))];

    // Helper to parse shelf life
    const parseShelfLife = (str) => {
        if (!str || str === '-') return 0;
        return parseInt(str.replace(/[^\d]/g, '')) || 0;
    };    

    // Filter Logic
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  p.barcode.includes(searchTerm) || 
                                  p.sku.toLowerCase().includes(searchTerm);
            
            const matchesSupplier = filters.supplier === 'all' || p.supplier === filters.supplier;
            const matchesBrand = filters.brand === 'all' || p.brand === filters.brand;
            const matchesCategory = filters.category === 'all' || p.category === filters.category;
            const matchesSubCategory = filters.subCategory === 'all' || p.subCategory === filters.subCategory;
            const matchesAnimal = filters.animal === 'all' || p.animal === filters.animal;

            let matchesTab = true;
            // Updated Logic for "Out of System"
            const isGeneric = p.brand === 'Generic';

            if (activeTab === 'นอกระบบ') matchesTab = isGeneric; // Only Generic items
            else if (activeTab === 'ใกล้หมด') matchesTab = p.stock <= p.stockPolicy.min && p.stock > 0 && !isGeneric; // Exclude Generic
            else if (activeTab === 'หมด') matchesTab = p.stock === 0 && !isGeneric; // Exclude Generic
            else if (activeTab === 'ค้างสต็อก') matchesTab = parseShelfLife(p.shelfLife) > 90; // Shelf life > 90 days
            // 'ทั้งหมด' shows everything

            return matchesSearch && matchesSupplier && matchesBrand && matchesCategory && matchesSubCategory && matchesAnimal && matchesTab;
        });
    }, [products, searchTerm, filters, activeTab]);

    const counts = {
        all: products.length,
        outOfSystem: products.filter(p => p.brand === 'Generic').length, 
        lowStock: products.filter(p => p.stock <= p.stockPolicy.min && p.stock > 0 && p.brand !== 'Generic').length,
        outOfStock: products.filter(p => p.stock === 0 && p.brand !== 'Generic').length,
        deadStock: products.filter(p => parseShelfLife(p.shelfLife) > 90).length, 
    };

    const tabs = [
        { id: 'ทั้งหมด', label: 'ทั้งหมด', count: counts.all },
        { id: 'นอกระบบ', label: 'นอกระบบ', count: counts.outOfSystem },
        { id: 'ใกล้หมด', label: 'ใกล้หมด', count: counts.lowStock },
        { id: 'หมด', label: 'หมด', count: counts.outOfStock },
        { id: 'ค้างสต็อก', label: 'ค้างสต็อก', count: counts.deadStock },
    ];

    const toggleFilterDropdown = (key) => {
        setFilterDropdowns(prev => ({ 
            supplier: false, brand: false, category: false, subCategory: false, 
            [key]: !prev[key] 
        }));
    };

    const [inputQuantities, setInputQuantities] = useState({});

    const handleQuantityChange = (id, value) => {
        setInputQuantities(prev => ({...prev, [id]: parseInt(value) || 0}));
    };

    const getRecommendedQty = (product) => {
        if (product.stock <= product.stockPolicy.min) {
            return product.stockPolicy.max - product.stock;
        }
        return 0;
    };

    const togglePurchaseRequestItem = (product, quantity) => {
        const exists = purchaseRequestItems.find(p => p.id === product.id);
        if (exists) {
             addToPurchaseRequest(product, 0);
        } else {
            addToPurchaseRequest(product, quantity > 0 ? quantity : 1);
        }
    };

    // Cart Handlers
    const handleUpdateCartQty = (id, qty) => {
        const product = products.find(p => p.id === id);
        if(product) addToPurchaseRequest(product, qty);
    };

    const handleRemoveFromCart = (id) => {
        const product = products.find(p => p.id === id);
        if(product) addToPurchaseRequest(product, 0);
    };

    const handleSelectItems = (ids, isSelecting) => {
        const newSelected = new Set(selectedItems);
        ids.forEach(id => {
            if(isSelecting) newSelected.add(id);
            else newSelected.delete(id);
        });
        setSelectedItems(newSelected);
    };

    const handleSelectAll = (isSelecting) => {
        if (isSelecting) {
            setSelectedItems(new Set(purchaseRequestItems.map(i => i.id)));
        } else {
            setSelectedItems(new Set());
        }
    };

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
            <PurchasingSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={handleNavigate} activePage={activePage} onChangePage={setActivePage} />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 relative z-30">
                   {activePage === 'overview' ? (
                       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                           <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ภาพรวมคลังสินค้า</h1>
                       </div>
                   ) : (
                       <div className="flex items-center gap-4">
                           <button onClick={() => setActivePage('overview')} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={24} className="text-gray-600" /></button>
                           <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ตะกร้าสินค้า</h1>
                       </div>
                   )}
                   
                   {activePage === 'overview' && (
                       <div className="ml-auto relative w-64">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                           <input 
                               type="text" 
                               placeholder="ค้นหา" 
                               value={searchTerm}
                               onChange={(e) => setSearchTerm(e.target.value)}
                               className={`${FONTS.header} w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition`}
                           />
                       </div>
                   )}
                </header>

                {activePage === 'overview' ? (
                    <div className="flex-1 p-8 overflow-hidden flex flex-col">
                        {/* Tabs */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex gap-2">
                                {tabs.map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}
                                    >
                                        {tab.label}
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{tab.count}</span>
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setActivePage('cart')} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm relative group">
                                <ShoppingCart size={18} className="text-gray-500 group-hover:text-emerald-500 transition" />
                                ตะกร้า
                                {purchaseRequestItems.length > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">{purchaseRequestItems.length}</span>
                                )}
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap items-center gap-3 mb-6" ref={dropdownRef}>
                            <div className="relative">
                                <button onClick={() => toggleFilterDropdown('supplier')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">
                                    {filters.supplier === 'all' ? 'ผู้จัดจำหน่าย' : filters.supplier} <ChevronDown size={14} />
                                </button>
                                {filterDropdowns.supplier && (
                                    <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => {setFilters({...filters, supplier: 'all'}); setFilterDropdowns({...filterDropdowns, supplier: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>
                                        {uniqueSuppliers.map(s => <button key={s} onClick={() => {setFilters({...filters, supplier: s}); setFilterDropdowns({...filterDropdowns, supplier: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button onClick={() => toggleFilterDropdown('brand')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">
                                    {filters.brand === 'all' ? 'ยี่ห้อสินค้า' : filters.brand} <ChevronDown size={14} />
                                </button>
                                {filterDropdowns.brand && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => {setFilters({...filters, brand: 'all'}); setFilterDropdowns({...filterDropdowns, brand: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>
                                        {uniqueBrands.map(s => <button key={s} onClick={() => {setFilters({...filters, brand: s}); setFilterDropdowns({...filterDropdowns, brand: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button onClick={() => toggleFilterDropdown('category')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">
                                    {filters.category === 'all' ? 'กลุ่มสินค้า' : filters.category} <ChevronDown size={14} />
                                </button>
                                {filterDropdowns.category && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => {setFilters({...filters, category: 'all'}); setFilterDropdowns({...filterDropdowns, category: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>
                                        {uniqueCategories.map(s => <button key={s} onClick={() => {setFilters({...filters, category: s}); setFilterDropdowns({...filterDropdowns, category: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}
                                    </div>
                                )}
                            </div>
                            <div className="relative">
                                <button onClick={() => toggleFilterDropdown('subCategory')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">
                                    {filters.subCategory === 'all' ? 'กลุ่มสินค้าย่อย' : filters.subCategory} <ChevronDown size={14} />
                                </button>
                                {filterDropdowns.subCategory && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                        <button onClick={() => {setFilters({...filters, subCategory: 'all'}); setFilterDropdowns({...filterDropdowns, subCategory: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>
                                        {uniqueSubCategories.map(s => <button key={s} onClick={() => {setFilters({...filters, subCategory: s}); setFilterDropdowns({...filterDropdowns, subCategory: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}
                                    </div>
                                )}
                            </div>

                            <div className="h-8 w-px bg-gray-300 mx-2"></div>
                            <div className="flex gap-1">
                                {PURCHASING_ANIMAL_FILTERS.map((a, i) => (
                                    <button 
                                        key={i} 
                                        onClick={() => setFilters({...filters, animal: filters.animal === a.type ? 'all' : a.type})}
                                        className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition ${filters.animal === a.type ? 'bg-yellow-100 border-yellow-400' : 'bg-white hover:bg-gray-50 border-gray-200'}`}
                                    >
                                        {a.icon}
                                    </button>
                                ))}
                            </div>
                            <div className="ml-auto flex gap-2">
                                <button onClick={() => setViewMode('list')} className={`p-2 border rounded-lg hover:text-gray-900 transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white text-gray-400 border-gray-200'}`}><List size={20} /></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 border rounded-lg hover:text-gray-900 transition ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white text-gray-400 border-gray-200'}`}><Grid size={20} /></button>
                            </div>
                        </div>

                        {/* Product View */}
                        {viewMode === 'list' ? (
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                <div className="overflow-y-auto flex-1 custom-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 sticky top-0 z-10 text-xs text-gray-500 uppercase">
                                            <tr>
                                                <th className="p-4 pl-6 font-bold">ชื่อ</th>
                                                <th className="p-4 font-bold">รหัสสินค้า</th>
                                                <th className="p-4 font-bold">ราคา</th>
                                                <th className="p-4 font-bold">สต็อก</th>
                                                <th className="p-4 font-bold text-center">แจ้งเตือน</th>
                                                <th className="p-4 font-bold">SHELF LIFE</th>
                                                <th className="p-4 font-bold text-center">จำนวนแนะนำให้ซื้อ</th>
                                                <th className="p-4 font-bold"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50 text-sm">
                                            {filteredProducts.map((product) => {
                                                const isInRequest = purchaseRequestItems.some(item => item.id === product.id);
                                                const recommendQty = getRecommendedQty(product);
                                                const inputQty = inputQuantities[product.id] !== undefined ? inputQuantities[product.id] : recommendQty;

                                                return (
                                                    <tr key={product.id} className="hover:bg-gray-50 transition group">
                                                        <td className="p-4 pl-6">
                                                            <div className="font-bold text-gray-800">{product.name}</div>
                                                            <div className="text-xs text-gray-400">{product.brand}</div>
                                                        </td>
                                                        <td className="p-4">
                                                            <div className="text-gray-800 font-mono text-xs">{product.barcode}</div>
                                                            <div className="text-gray-400 text-[10px]">{product.sku}</div>
                                                        </td>
                                                        <td className="p-4 text-gray-800 font-medium">{product.price} บาท</td>
                                                        <td className="p-4 text-gray-800">{product.stock} {product.unit}</td>
                                                        <td className="p-4 text-center">
                                                            {product.stock === 0 ? <AlertCircle className="text-red-500 mx-auto" size={18} /> : 
                                                            product.stock <= product.stockPolicy.min ? <AlertTriangle className="text-orange-500 mx-auto" size={18} /> : 
                                                            <CheckCircle2 className="text-green-500 mx-auto" size={18} />}
                                                        </td>
                                                        <td className="p-4 text-gray-600">{product.shelfLife}</td>
                                                        <td className="p-4 text-center">
                                                            <input 
                                                                type="number" 
                                                                value={inputQty}
                                                                onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                                className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center text-gray-700 focus:border-yellow-400 outline-none"
                                                            />
                                                        </td>
                                                        <td className="p-4 text-right">
                                                            <button 
                                                                onClick={() => togglePurchaseRequestItem(product, inputQty)}
                                                                className={`w-9 h-9 flex items-center justify-center rounded-lg transition shadow-sm ${isInRequest ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900'}`}
                                                            >
                                                                {isInRequest ? <ShoppingBasket size={18} /> : <Plus size={18} />}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1 custom-scrollbar pb-4">
                                {filteredProducts.map((product) => {
                                    const isInRequest = purchaseRequestItems.some(item => item.id === product.id);
                                    const recommendQty = getRecommendedQty(product);
                                    const inputQty = inputQuantities[product.id] !== undefined ? inputQuantities[product.id] : recommendQty;

                                    return (
                                        <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                                            {/* Grid View Content (Same as before but updated button) */}
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="bg-gray-100 text-xs px-2 py-1 rounded-md text-gray-600">{product.brand}</div>
                                                {product.stock <= product.stockPolicy.min && <AlertTriangle size={16} className="text-orange-500" />}
                                            </div>
                                            <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10">{product.name}</h3>
                                            <div className="text-xs text-gray-500 mb-4 font-mono">{product.barcode}</div>
                                            <div className="flex justify-between items-center text-sm mb-2">
                                                <span className="text-gray-500">สต็อก</span>
                                                <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : 'text-gray-800'}`}>{product.stock} {product.unit}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm mb-4">
                                                <span className="text-gray-500">ราคา</span>
                                                <span className="font-bold text-gray-800">{product.price}</span>
                                            </div>
                                            <div className="mt-auto flex items-center gap-2">
                                                <input type="number" value={inputQty} onChange={(e) => handleQuantityChange(product.id, e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-center text-gray-700 text-sm focus:border-yellow-400 outline-none" />
                                                <button onClick={() => togglePurchaseRequestItem(product, inputQty)} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg transition ${isInRequest ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900'}`}>
                                                    {isInRequest ? <ShoppingBasket size={18} /> : <Plus size={18} />}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : (
                    // --- CART VIEW (MARKETPLACE STYLE) ---
                    <CartView 
                        items={purchaseRequestItems} 
                        onUpdateQty={handleUpdateCartQty} 
                        onRemove={handleRemoveFromCart}
                        onSelect={handleSelectItems}
                        selectedItems={selectedItems}
                        onSelectAll={handleSelectAll}
                    />
                )}
            </div>
        </div>
    );
};

const SettingsModule = ({ settings, setSettings, onNavigate, setIsDrawerOpen }) => {
    const [localSettings, setLocalSettings] = useState(settings);
    const [activePage, setActivePage] = useState('general');

    const handleSave = () => {
        setSettings(localSettings);
        alert('บันทึกการตั้งค่าเรียบร้อย');
    };

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
            <SettingsSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={onNavigate} activePage={activePage} onChangePage={setActivePage} />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 relative z-30">
                    <div>
                        <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ตั้งค่าร้านค้า</h1>
                        <p className={`${FONTS.body} text-sm text-gray-400`}>จัดการข้อมูลพื้นฐานของระบบ</p>
                    </div>
                </header>
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 max-w-3xl">
                        <div className="flex items-center gap-2 mb-4 text-emerald-600 pb-2 border-b border-gray-100">
                            <Store size={20} />
                            <h3 className={`${FONTS.header} font-bold text-lg`}>ข้อมูลร้านค้า</h3>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ชื่อร้านค้า</label>
                                <input 
                                    type="text" 
                                    value={localSettings.shopName} 
                                    onChange={(e) => setLocalSettings({...localSettings, shopName: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">สาขา</label>
                                <input 
                                    type="text" 
                                    value={localSettings.branch} 
                                    onChange={(e) => setLocalSettings({...localSettings, branch: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none" 
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">ภาษีมูลค่าเพิ่ม (%)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={localSettings.taxRate * 100} 
                                        onChange={(e) => setLocalSettings({...localSettings, taxRate: parseFloat(e.target.value) / 100})}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-200 outline-none" 
                                    />
                                    <span className="absolute right-4 top-2 text-gray-400">%</span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">สกุลเงิน</label>
                                <select 
                                    value={localSettings.currency} 
                                    onChange={(e) => setLocalSettings({...localSettings, currency: e.target.value})}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
                                >
                                    <option value="THB">THB (฿)</option>
                                    <option value="USD">USD ($)</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                            <button onClick={() => setLocalSettings(settings)} className="px-6 py-2 rounded-xl text-gray-500 hover:bg-gray-100 font-bold transition">คืนค่าเดิม</button>
                            <button onClick={handleSave} className="px-6 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition flex items-center gap-2">
                                <Save size={18} /> บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const POSModule = ({ 
    cartItems, setCartItems, currentMember, recommendedItems, 
    handleNavigate, setIsDrawerOpen, setIsMemberSearchOpen, setIsNewMemberOpen, 
    addToCart, calculateTotal, settings // Added Settings Prop
}) => {
  const subtotal = calculateTotal();
  const taxAmount = subtotal * settings.taxRate;
  const grandTotal = subtotal + taxAmount - 220; // Example discount logic kept

  return (
  <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
    <POSSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={handleNavigate} />
    <div className="flex-1 flex flex-col min-w-0">
      <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4"><div className="flex flex-col"><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}><span onClick={() => setIsMemberSearchOpen(true)} className="hover:text-emerald-600 hover:underline cursor-pointer transition">{currentMember.name}</span><span onClick={() => setIsMemberSearchOpen(true)} className="text-emerald-500 cursor-pointer bg-emerald-50 p-1 rounded-full hover:bg-emerald-100 transition"><Search size={18} /></span><span onClick={() => setIsNewMemberOpen(true)} className="text-emerald-500 cursor-pointer bg-emerald-50 p-1 rounded-full hover:bg-emerald-100 transition"><Plus size={18} /></span></h2><p className={`${FONTS.body} text-gray-400 text-sm flex items-center gap-1`}><Smartphone size={14} /> {currentMember.phone}</p></div></div>
        <div className="flex items-center gap-8"><div className="flex items-center text-gray-400 gap-2"><Users size={18} /> <span className="font-bold">{currentMember.pets?.length || 0}</span><span className="mx-1">|</span><Scissors size={18} /> <span className="font-bold">{currentMember.visits}</span></div><div className={`border rounded-xl px-4 py-2 flex items-center gap-3 transition-colors ${currentMember.theme === 'amber' ? 'bg-amber-50 border-amber-100' : currentMember.theme === 'purple' ? 'bg-purple-50 border-purple-100' : currentMember.theme === 'gray' ? 'bg-gray-50 border-gray-200' : 'bg-slate-50 border-slate-200'}`}><div className="text-right"><p className={`${FONTS.header} text-xs font-bold ${currentMember.theme === 'amber' ? 'text-amber-600' : currentMember.theme === 'purple' ? 'text-purple-600' : currentMember.theme === 'gray' ? 'text-gray-600' : 'text-slate-600'}`}>ระดับสมาชิก</p><p className={`${FONTS.header} text-sm font-bold ${currentMember.theme === 'amber' ? 'text-amber-500' : currentMember.theme === 'purple' ? 'text-purple-500' : currentMember.theme === 'gray' ? 'text-gray-500' : 'text-slate-500'}`}>★ {currentMember.level}</p></div><div className={`h-8 w-px ${currentMember.theme === 'amber' ? 'bg-amber-200' : currentMember.theme === 'purple' ? 'bg-purple-200' : 'bg-gray-200'}`}></div><div className="text-right"><p className={`${FONTS.header} text-xs font-bold text-gray-500`}>คะแนนสะสม</p><p className={`${FONTS.header} text-lg font-bold text-gray-800`}>{currentMember.points.toLocaleString()}</p></div></div></div>
      </header>
      <div className="flex-1 p-6 flex gap-6 overflow-hidden">
         <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-6 pb-2"><div className="relative"><Scan className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} /><input type="text" placeholder="สแกนบาร์โค้ด หรือ ค้นหาสินค้า..." className={`${FONTS.header} w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-emerald-400 focus:bg-white transition-all outline-none text-lg text-gray-700 placeholder-gray-400`} /></div></div>
            <div className="px-6 py-3 grid grid-cols-12 gap-4 text-gray-400 text-xs font-bold border-b border-gray-100"><div className="col-span-4 text-left pl-2">ชื่อสินค้า</div><div className="col-span-2 text-center">ราคา</div><div className="col-span-2 text-center">ส่วนลด</div><div className="col-span-2 text-center">จำนวน</div><div className="col-span-1 text-center">รวม</div><div className="col-span-1 text-center">หน่วย</div></div>
            <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">{cartItems.map((item) => (<div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 hover:bg-gray-50 rounded-xl transition px-2 group"><div className="col-span-4 flex items-center gap-3"><div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 font-bold shrink-0">{item.code}</div><div><p className={`${FONTS.header} text-gray-800 font-medium text-sm line-clamp-2`}>{item.name}</p></div></div><div className="col-span-2 text-center"><p className={`${FONTS.body} text-gray-800 font-bold`}>{item.price.toFixed(2)}</p></div><div className="col-span-2 flex flex-col items-center justify-center gap-1">{item.discount > 0 ? (<span className="text-red-500 text-xs font-bold">-{item.discount}</span>) : (<span className="text-gray-300 text-xs">-</span>)}{item.promo && (<span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{item.promo}</span>)}</div><div className="col-span-2 flex justify-center"><div className="flex items-center bg-white border border-gray-200 rounded-lg h-8"><button className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-l-lg transition" onClick={() => { setCartItems(prev => prev.map(i => i.id === item.id ? {...i, qty: i.qty - 1} : i).filter(i => i.qty > 0)); }}><Minus size={14} /></button><input type="text" value={item.qty} readOnly className="w-8 text-center text-sm font-bold text-gray-700 outline-none" /><button className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-r-lg transition" onClick={() => { const newItems = cartItems.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i); setCartItems(newItems); }}><Plus size={14} /></button></div></div><div className="col-span-1 text-center"><span className={`${FONTS.header} text-emerald-600 font-bold`}>{settings.currencySymbol}{((item.price * item.qty) - item.discount).toLocaleString()}</span></div><div className="col-span-1 text-center"><span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">{item.unit}</span></div></div>))} {cartItems.length === 0 && (<div className="flex flex-col items-center justify-center h-40 text-gray-400"><Store size={48} className="mb-2 opacity-20" /><p className={`${FONTS.body}`}>ไม่มีสินค้าในตะกร้า</p></div>)}</div>
            <div className="bg-gray-50 p-6 rounded-b-3xl border-t border-gray-100"><div className="flex justify-between items-end mb-4"><div className="space-y-1 text-right w-1/2"><div className="flex justify-between text-gray-500 text-sm"><span>ส่วนลดท้ายบิล</span><span className="font-bold text-gray-800">-{settings.currencySymbol}220</span></div><div className="flex justify-between text-gray-500 text-sm"><span>ภาษีมูลค่าเพิ่ม ({(settings.taxRate * 100)}%)</span><span className="font-bold text-gray-800">{settings.currencySymbol}{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div></div><div className="flex flex-col items-end"><span className={`${FONTS.header} text-gray-500 text-sm`}>ยอดรวมสุทธิ</span><span className={`${FONTS.header} text-4xl font-bold text-emerald-600`}>{settings.currencySymbol}{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div></div><div className="grid grid-cols-12 gap-3 h-16"><button className="col-span-2 bg-white border border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition">พักบิล</button><button className="col-span-2 bg-white border border-emerald-500 text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition">เรียกบิล</button><div className="col-span-4 grid grid-cols-4 gap-2">{[{ icon: Wallet, label: 'เงินสด' }, { icon: CreditCard, label: 'โอนเงิน' }, { icon: QrCode, label: 'สแกน' }, { icon: Smartphone, label: 'Wallet' }].map((m, i) => (<button key={i} className="bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-emerald-500 hover:text-emerald-500 transition"><m.icon size={18} /><span className="text-[10px] mt-1">{m.label}</span></button>))}</div><button className="col-span-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-bold shadow-lg shadow-emerald-200 transition-all active:scale-95">ชำระเงิน</button></div></div>
         </div>
         <div className="w-80 flex flex-col gap-6 shrink-0">
            <div className="flex items-center justify-center gap-4 py-2">{[{ name: 'Brownie', badge: 2, img: '🐕' }, { name: 'Muffin', badge: 1, img: '🐈' }].map((pet, i) => (<div key={i} className="flex flex-col items-center gap-2 cursor-pointer group"><div className="relative w-14 h-14 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-2xl group-hover:scale-110 transition">{pet.img}<div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center border-2 border-white">{pet.badge}</div></div><span className={`${FONTS.header} text-xs font-bold text-gray-600`}>{pet.name}</span></div>))}<div className="flex flex-col items-center gap-2 cursor-pointer group"><div className="w-14 h-14 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition bg-white"><Plus size={24} /></div><span className={`${FONTS.header} text-xs font-bold text-gray-400`}>เพิ่มสัตว์เลี้ยง</span></div></div>
            <div className="bg-white p-1 rounded-xl flex shadow-sm border border-gray-100">{['ประวัติ', 'แนะนำ', 'โปรฯ'].map((tab, i) => (<button key={i} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${i === 1 ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>{i === 1 && <Star size={14} className="inline mr-1 mb-0.5" />}{tab}</button>))}</div>
            <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col overflow-hidden"><div className="overflow-y-auto space-y-3 pr-1 custom-scrollbar">{recommendedItems.map((item) => (<div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition group cursor-pointer"><div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500"><Package size={20} /></div><div className="flex-1 min-w-0"><h4 className={`${FONTS.header} text-sm font-bold text-gray-700 truncate`}>{item.name}</h4><p className="text-emerald-600 text-xs font-bold">฿{item.price.toLocaleString()}</p></div><button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition"><Plus size={16} /></button></div>))}</div></div>
         </div>
      </div>
    </div>
  </div>
  );
};

const CRMModule = ({ 
    filteredMembers, crmSearchTerm, setCrmSearchTerm, crmFilterPet, togglePetFilter, 
    crmFilterLevel, setCrmFilterLevel, isLevelDropdownOpen, setIsLevelDropdownOpen,
    handleNavigate, setIsDrawerOpen, setIsNewMemberOpen 
}) => {
    const dropdownRef = useRef(null);
    const [activeTab, setActiveTab] = useState('members'); // 'members' or 'pets'
    const [petFilter, setPetFilter] = useState({ search: '', type: 'all', age: 'all', weight: 'all', disease: 'all' });
    const [isAgeDropdownOpen, setIsAgeDropdownOpen] = useState(false);
    const [isWeightDropdownOpen, setIsWeightDropdownOpen] = useState(false);
    const [isDiseaseDropdownOpen, setIsDiseaseDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLevelDropdownOpen(false);
                setIsAgeDropdownOpen(false);
                setIsWeightDropdownOpen(false);
                setIsDiseaseDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef, setIsLevelDropdownOpen]);

    // --- Pet Filter Logic ---
    const calculateAge = (birthYear) => new Date().getFullYear() - birthYear;

    const filteredPets = useMemo(() => {
        return PetsDB.filter(pet => {
            const age = calculateAge(pet.birthYear);
            const matchesSearch = pet.name.includes(petFilter.search) || pet.ownerName.includes(petFilter.search) || pet.phone.includes(petFilter.search) || pet.chronicDiseases.some(d => d.includes(petFilter.search));
            const matchesType = petFilter.type === 'all' || pet.type === petFilter.type;
            
            let matchesAge = true;
            if (petFilter.age === '<1 ปี') matchesAge = age < 1;
            else if (petFilter.age === '1-5 ปี') matchesAge = age >= 1 && age <= 5;
            else if (petFilter.age === '5-7 ปี') matchesAge = age > 5 && age <= 7;
            else if (petFilter.age === '7 ปีขึ้นไป') matchesAge = age > 7;

            let matchesWeight = true;
            const w = pet.weight;
            if (petFilter.weight === '< 1 กก.') matchesWeight = w < 1;
            else if (petFilter.weight === '1-2.5 กก.') matchesWeight = w >= 1 && w <= 2.5;
            else if (petFilter.weight === '2.5-5 กก.') matchesWeight = w > 2.5 && w <= 5;
            else if (petFilter.weight === '5-10 กก.') matchesWeight = w > 5 && w <= 10;
            else if (petFilter.weight === '10-15 กก.') matchesWeight = w > 10 && w <= 15;
            else if (petFilter.weight === '15-25 กก.') matchesWeight = w > 15 && w <= 25;
            else if (petFilter.weight === '25 กก.ขึ้นไป') matchesWeight = w > 25;

            let matchesDisease = true;
            if (petFilter.disease !== 'all') {
                matchesDisease = pet.chronicDiseases.includes(petFilter.disease);
            }

            return matchesSearch && matchesType && matchesAge && matchesWeight && matchesDisease;
        });
    }, [petFilter]);

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
             <CRMSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={handleNavigate} activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-center shrink-0 relative">
                   <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>{activeTab === 'members' ? 'รายชื่อสมาชิก' : 'รายชื่อสัตว์เลี้ยงสมาชิก'}</h1>
                </header>
                
                {activeTab === 'members' ? (
                    <div className="flex-1 p-8 overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center mb-6 gap-4">
                            <div className="flex-1 relative max-w-lg">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input type="text" placeholder="ค้นหา ชื่อ, เบอร์โทร, ที่อยู่" value={crmSearchTerm} onChange={(e) => setCrmSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition text-gray-700`} />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-2 mr-4">{PET_FILTER_BUTTONS.map(pet => (<button key={pet.type} onClick={() => togglePetFilter(pet.type)} className={`w-10 h-10 rounded-full border flex items-center justify-center text-2xl transition-all ${crmFilterPet === pet.type ? 'bg-yellow-100 border-yellow-400 shadow-md scale-110' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>{pet.icon}</button>))}</div>
                                <div className="relative" ref={dropdownRef}>
                                    <button onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 min-w-[160px] justify-between"><span>{crmFilterLevel === 'ทั้งหมด' ? 'ระดับสมาชิก' : crmFilterLevel}</span><ChevronDown size={16} className={`transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`}/></button>
                                    {isLevelDropdownOpen && (<div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">{MEMBER_LEVEL_OPTIONS.map(option => (<button key={option} onClick={() => { setCrmFilterLevel(option); setIsLevelDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium ${crmFilterLevel === option ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'}`}>{option}</button>))}</div>)}
                                </div>
                                <button onClick={() => setIsNewMemberOpen(true)} className={`${FONTS.header} px-6 py-3 bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900 font-bold rounded-xl shadow-lg shadow-yellow-100 transition flex items-center gap-2`}><Plus size={20} /> เพิ่มสมาชิก</button>
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 sticky top-0 z-10"><tr><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>รหัสสมาชิก</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>ชื่อสมาชิก</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>เลี้ยง</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>ระดับสมาชิก</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>คะแนน</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>Line</th></tr></thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredMembers.length > 0 ? (filteredMembers.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50 transition group cursor-pointer"><td className={`${FONTS.body} p-6 text-gray-600 font-medium`}>{member.id}</td><td className="p-6"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${member.theme === 'amber' ? 'bg-amber-400' : member.theme === 'purple' ? 'bg-purple-500' : member.theme === 'blue' ? 'bg-blue-500' : member.theme === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'}`}>{member.name.split(' ')[1]?.charAt(0) || 'A'}</div><span className={`${FONTS.header} font-bold text-gray-800`}>{member.name}</span></div></td><td className="p-6 text-center"><div className="flex justify-center -space-x-2">{member.pets.map((p, i) => (<div key={i} className="w-8 h-8 rounded-full bg-orange-50 border-2 border-white flex items-center justify-center text-sm shadow-sm z-0 relative">{p === 'dog' ? '🐶' : p === 'cat' ? '🐱' : p === 'rabbit' ? '🐰' : p === 'fish' ? '🐟' : '🦜'}</div>))}</div></td><td className="p-6 text-center"><span className={`${FONTS.header} px-4 py-1.5 rounded-full text-xs font-bold ${member.levelColor}`}>{member.level}</span></td><td className={`${FONTS.header} p-6 text-center font-bold text-gray-800`}>{member.points.toLocaleString()}</td><td className="p-6 text-center"><div className="flex justify-center">{member.line ? (<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md shadow-green-200"><MessageCircle size={16} fill="white" /></div>) : (<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400"><Minus size={16} /></div>)}</div></td></tr>
                                        ))) : (<tr><td colSpan="6" className="p-12 text-center text-gray-400"><div className="flex flex-col items-center justify-center"><Search size={48} className="mb-4 opacity-20" /><p className={`${FONTS.header} text-lg font-medium`}>ไม่พบข้อมูลสมาชิก</p><p className={`${FONTS.body} text-sm`}>ลองปรับเปลี่ยนเงื่อนไขการค้นหาใหม่</p></div></td></tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : (
                    // --- PET LIST VIEW ---
                    <div className="flex-1 p-8 overflow-hidden flex flex-col">
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4" ref={dropdownRef}>
                            <div className="flex-1 relative min-w-[300px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input type="text" placeholder="ชื่อน้อง, เจ้าของ, เบอร์โทร, โรคประจำตัว" value={petFilter.search} onChange={(e) => setPetFilter({...petFilter, search: e.target.value})} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition text-gray-700`} />
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <div className="flex gap-2 mr-2">
                                    {PET_FILTER_BUTTONS.map(pet => (
                                        <button key={pet.type} onClick={() => setPetFilter({...petFilter, type: petFilter.type === pet.type ? 'all' : pet.type})} className={`w-10 h-10 rounded-full border flex items-center justify-center text-2xl transition-all ${petFilter.type === pet.type ? 'bg-yellow-100 border-yellow-400 shadow-md scale-110' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>{pet.icon}</button>
                                    ))}
                                </div>
                                <div className="relative">
                                    <button onClick={() => setIsAgeDropdownOpen(!isAgeDropdownOpen)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 min-w-[120px] justify-between"><span>{petFilter.age === 'all' ? 'อายุ' : petFilter.age}</span><ChevronDown size={16} /></button>
                                    {isAgeDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                            {['all', '<1 ปี', '1-5 ปี', '5-7 ปี', '7 ปีขึ้นไป'].map(opt => (<button key={opt} onClick={() => {setPetFilter({...petFilter, age: opt}); setIsAgeDropdownOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{opt === 'all' ? 'ทั้งหมด' : opt}</button>))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button onClick={() => setIsWeightDropdownOpen(!isWeightDropdownOpen)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 min-w-[140px] justify-between"><span>{petFilter.weight === 'all' ? 'น้ำหนัก' : petFilter.weight}</span><ChevronDown size={16} /></button>
                                    {isWeightDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar">
                                            {['all', '< 1 กก.', '1-2.5 กก.', '2.5-5 กก.', '5-10 กก.', '10-15 กก.', '15-25 กก.', '25 กก.ขึ้นไป'].map(opt => (<button key={opt} onClick={() => {setPetFilter({...petFilter, weight: opt}); setIsWeightDropdownOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{opt === 'all' ? 'ทั้งหมด' : opt}</button>))}
                                        </div>
                                    )}
                                </div>
                                <div className="relative">
                                    <button onClick={() => setIsDiseaseDropdownOpen(!isDiseaseDropdownOpen)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 min-w-[150px] justify-between"><span>{petFilter.disease === 'all' ? 'โรคประจำตัว' : petFilter.disease}</span><ChevronDown size={16} /></button>
                                    {isDiseaseDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                                            {['all', 'ทำหมันแล้ว', 'กระเพาะ', 'นิ่ว', 'โรคหัวใจ', 'เบาหวาน', 'โรคไต'].map(opt => (<button key={opt} onClick={() => {setPetFilter({...petFilter, disease: opt}); setIsDiseaseDropdownOpen(false)}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{opt === 'all' ? 'ทั้งหมด' : opt}</button>))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 sticky top-0 z-10">
                                        <tr>
                                            <th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>รูปน้อง</th>
                                            <th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>ชื่อน้อง</th>
                                            <th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>เจ้าของ (ติดต่อ)</th>
                                            <th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>เพศ</th>
                                            <th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>โรคประจำตัว</th>
                                            <th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>ติดต่อ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {filteredPets.length > 0 ? (filteredPets.map((pet) => (
                                            <tr key={pet.id} className="hover:bg-gray-50 transition group cursor-pointer">
                                                <td className="p-6">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${pet.type === 'dog' ? 'bg-orange-100 text-orange-600' : pet.type === 'cat' ? 'bg-blue-100 text-blue-600' : pet.type === 'rabbit' ? 'bg-pink-100 text-pink-600' : 'bg-gray-100'}`}>
                                                        {pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : pet.type === 'rabbit' ? '🐰' : pet.type === 'fish' ? '🐟' : '🦜'}
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div>
                                                        <h4 className={`${FONTS.header} font-bold text-gray-800 text-lg`}>{pet.name}</h4>
                                                        <p className={`${FONTS.body} text-xs text-gray-500`}>{pet.breed} • {new Date().getFullYear() - pet.birthYear} ปี • {pet.weight} กก.</p>
                                                    </div>
                                                </td>
                                                <td className="p-6">
                                                    <div>
                                                        <p className={`${FONTS.header} font-bold text-gray-800`}>{pet.ownerName}</p>
                                                        <p className={`${FONTS.body} text-xs text-gray-500 flex items-center gap-1`}><Smartphone size={10} /> {pet.phone}</p>
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    {pet.gender === 'Male' 
                                                        ? <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mx-auto"><span className="text-xs font-bold">♂</span></div>
                                                        : <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto"><span className="text-xs font-bold">♀</span></div>
                                                    }
                                                </td>
                                                <td className="p-6">
                                                    <div className="flex flex-wrap gap-1">
                                                        {pet.chronicDiseases.length > 0 ? (
                                                            pet.chronicDiseases.map((d, i) => (
                                                                <span key={i} className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${d.includes('ทำหมัน') ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                                                                    {d.includes('ทำหมัน') ? <CheckCircle2 size={10} /> : <Activity size={10} />}
                                                                    {d}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-gray-300 text-xs">-</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-6 text-center">
                                                    <button className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm mx-auto ${pet.lineId ? 'bg-green-500 text-white hover:bg-green-600 shadow-green-200' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                                                        <MessageCircle size={18} fill="currentColor" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))) : (
                                            <tr><td colSpan="6" className="p-12 text-center text-gray-400"><p>ไม่พบข้อมูลสัตว์เลี้ยง</p></td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const PlaceholderModule = ({ title, icon: Icon, handleNavigate, setIsDrawerOpen }) => (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
       <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-emerald-100/50 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => handleNavigate('home')} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-800"><Home size={24} /></button>
          <div className="h-6 w-px bg-gray-300 mx-2"></div>
          <div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 rounded-lg"><Icon className="text-emerald-700 w-6 h-6" /></div><h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>{title}</h1></div>
        </div>
        <div className="flex items-center"><button onClick={() => setIsDrawerOpen(true)} className="p-2 hover:bg-gray-100 rounded-full"><Menu size={24} className="text-gray-500"/></button></div>
      </header>
      <div className="flex-1 p-8 flex items-center justify-center"><div className="text-center text-gray-400"><Icon size={64} className="mx-auto mb-4 opacity-50" /><h2 className="text-2xl font-bold">ระบบ {title}</h2><p>กำลังอยู่ในระหว่างการพัฒนา</p></div></div>
    </div>
);

// ==========================================
// MAIN COMPONENT (ROOT)
// ==========================================

const App = () => {
  // ==========================================
  // ZONE B: GLOBAL STATE
  // State หลักทั้งหมดอยู่ตรงนี้ (Lift State Up)
  // ==========================================
  const [currentView, setCurrentView] = useState('home');
  const [currentMember, setCurrentMember] = useState(INITIAL_MEMBERS_DB[0]);
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [membersDB, setMembersDB] = useState(INITIAL_MEMBERS_DB);
  const [purchaseRequestItems, setPurchaseRequestItems] = useState([]); // State for Purchasing Request
  const [settings, setSettings] = useState(SYSTEM_DEFAULTS); // Global Settings State

  // CRM Global Filter State (Persists across views)
  const [crmSearchTerm, setCrmSearchTerm] = useState('');
  const [crmFilterPet, setCrmFilterPet] = useState(null);
  const [crmFilterLevel, setCrmFilterLevel] = useState('ทั้งหมด');

  // ==========================================
  // ZONE C: LOCAL STATE & UI STATE
  // State เฉพาะหน้าจอ หรือ UI Toggles
  // ==========================================
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMemberSearchOpen, setIsMemberSearchOpen] = useState(false);
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  // Clock Effect
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // ==========================================
  // ZONE D: HELPER FUNCTIONS & LOGIC
  // ==========================================

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    setIsDrawerOpen(false);
  };

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.name === product.name);
      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = { ...updatedItems[existingItemIndex], qty: updatedItems[existingItemIndex].qty + 1 };
        return updatedItems;
      } else {
        const newItem = {
          id: Date.now(),
          name: product.name,
          price: product.price,
          discount: 0,
          stock: 99,
          promo: null,
          qty: 1,
          unit: 'ชิ้น',
          code: product.code || 'NEW'
        };
        return [...prevItems, newItem];
      }
    });
  };

  const addToPurchaseRequest = (product, quantity) => {
      if (quantity <= 0) return;
      setPurchaseRequestItems(prev => {
          const exists = prev.find(p => p.id === product.id);
          if (exists) return prev.map(p => p.id === product.id ? {...p, qty: quantity} : p);
          return [...prev, {...product, qty: quantity}];
      });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + ((item.price * item.qty) - (item.discount || 0)), 0);
  };

  const togglePetFilter = (pet) => {
    setCrmFilterPet(prev => prev === pet ? null : pet);
  };

  // Filter Logic
  const filteredCRMMembers = useMemo(() => {
    return membersDB.filter(member => {
        const matchesSearch = member.name.includes(crmSearchTerm) || member.phone.includes(crmSearchTerm) || member.id.includes(crmSearchTerm);
        const matchesPet = crmFilterPet ? member.pets.includes(crmFilterPet) : true;
        const matchesLevel = crmFilterLevel !== 'ทั้งหมด' ? member.level === crmFilterLevel : true;
        return matchesSearch && matchesPet && matchesLevel;
    });
  }, [membersDB, crmSearchTerm, crmFilterPet, crmFilterLevel]);

  // ==========================================
  // ZONE E: MAIN RENDER LOGIC
  // Layout Logic & Passing Props
  // ==========================================

  const renderContent = () => {
    if (currentView === 'home') {
        return (
            <div className="bg-[#141419] min-h-screen w-full flex flex-col overflow-hidden text-white font-sans selection:bg-purple-500 selection:text-white">
              <style>{`@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&family=Sarabun:wght@300;400;500;600&display=swap'); .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }`}</style>
              <header className="h-16 bg-[#1E1E24] flex items-center justify-between px-6 border-b border-gray-800">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50">
                        <span className={`${FONTS.header} font-bold text-xl`}>P</span>
                    </div>
                    <div>
                        <h1 className={`${FONTS.header} font-bold text-lg leading-tight`}>{settings.shopName}</h1>
                        <p className={`${FONTS.body} text-xs text-purple-400 font-medium`}>{settings.branch}</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 bg-[#2A2A32] px-3 py-1.5 rounded-full border border-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className={`${FONTS.body} text-sm text-gray-300`}>Online</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-400">
                        <div className="p-2 hover:bg-[#2A2A32] rounded-full transition cursor-pointer text-gray-400 hover:text-white">
                            <Upload size={20} />
                        </div>
                        <div className="p-2 hover:bg-[#2A2A32] rounded-full transition cursor-pointer text-gray-400 hover:text-white">
                            <Download size={20} />
                        </div>
                        <div className="relative p-2 hover:bg-[#2A2A32] rounded-full transition cursor-pointer text-gray-400 hover:text-white">
                            <Bell size={20} />
                            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#1E1E24]"></span>
                        </div>
                        <div className="p-2 hover:bg-[#2A2A32] rounded-full transition cursor-pointer text-gray-400 hover:text-white">
                            <Settings size={20} />
                        </div>
                    </div>

                    <div className="h-8 w-px bg-gray-700 mx-2"></div>

                    {/* Updated Profile Section */}
                    <div className="flex items-center gap-3 bg-[#2A2A32] pl-4 pr-2 py-1.5 rounded-full border border-gray-700 cursor-pointer hover:bg-[#32323c] transition group">
                        <div className="text-right">
                            <p className={`${FONTS.header} text-sm font-bold text-white group-hover:text-purple-300 transition`}>ผู้จัดการร้าน</p>
                            <p className={`${FONTS.body} text-xs text-gray-400 uppercase tracking-wider`}>Admin Access</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center border border-gray-500 shadow-inner">
                             <User size={16} className="text-gray-300" />
                        </div>
                    </div>
                </div>
              </header>
              <main className="flex-1 p-6 overflow-hidden"><div className="grid grid-cols-12 gap-6 h-full"><div className="col-span-3 flex flex-col gap-6 h-full"><div className="h-[55%]"><SalesChart /></div><div className="h-[45%]"><ServiceQueue /></div></div><div className="col-span-3 flex flex-col gap-6 h-full"><div className="h-[55%]"><OrderList /></div><div className="h-[45%]"><MessageBox /></div></div><div className="col-span-6 h-full"><MainMenuGrid onNavigate={handleNavigate} /></div></div></main>
            </div>
        );
    }

    if (currentView === 'pos') return (
        <POSModule 
            cartItems={cartItems} 
            setCartItems={setCartItems} 
            currentMember={currentMember} 
            recommendedItems={RECOMMENDED_ITEMS} 
            handleNavigate={handleNavigate} 
            setIsDrawerOpen={setIsDrawerOpen} 
            setIsMemberSearchOpen={setIsMemberSearchOpen} 
            setIsNewMemberOpen={setIsNewMemberOpen} 
            addToCart={addToCart} 
            calculateTotal={calculateTotal}
            settings={settings}
        />
    );

    if (currentView === 'crm') return (
        <CRMModule 
            filteredMembers={filteredCRMMembers}
            crmSearchTerm={crmSearchTerm}
            setCrmSearchTerm={setCrmSearchTerm}
            crmFilterPet={crmFilterPet}
            togglePetFilter={togglePetFilter}
            crmFilterLevel={crmFilterLevel}
            setCrmFilterLevel={setCrmFilterLevel}
            isLevelDropdownOpen={isLevelDropdownOpen}
            setIsLevelDropdownOpen={setIsLevelDropdownOpen}
            handleNavigate={handleNavigate}
            setIsDrawerOpen={setIsDrawerOpen}
            setIsNewMemberOpen={setIsNewMemberOpen}
        />
    );

    if (currentView === 'purchasing') return (
        <PurchasingModule 
            products={PetProductsDB}
            handleNavigate={handleNavigate}
            setIsDrawerOpen={setIsDrawerOpen}
            purchaseRequestItems={purchaseRequestItems}
            addToPurchaseRequest={addToPurchaseRequest}
        />
    );

    // Replace Placeholder with Real Settings Module
    if (currentView === 'settings') return (
        <SettingsModule 
            settings={settings}
            setSettings={setSettings}
            onNavigate={handleNavigate}
            setIsDrawerOpen={setIsDrawerOpen}
        />
    );

    const modules = {
      dashboard: { title: 'Dashboard Analytics', icon: LayoutDashboard },
      booking: { title: 'ระบบการจอง', icon: CalendarDays },
      // purchasing: { title: 'ภาพรวมคลังสินค้า', icon: Package }, // Handled above
      promo: { title: 'จัดการโปรโมชั่น', icon: Tag },
      expenses: { title: 'บันทึกค่าใช้จ่าย', icon: Receipt },
      // settings: { title: 'ตั้งค่าร้านค้า', icon: Settings }, // Handled above
      help: { title: 'ศูนย์ช่วยเหลือ', icon: HelpCircle },
      master: { title: 'Master Data', icon: Database },
      contacts: { title: 'รายชื่อผู้ติดต่อ', icon: Contact },
      reports: { title: 'รายงาน', icon: FileBarChart },
    };
    
    const currentModule = modules[currentView];
    if (currentModule) {
      return <PlaceholderModule title={currentModule.title} icon={currentModule.icon} handleNavigate={handleNavigate} setIsDrawerOpen={setIsDrawerOpen} />;
    }
    
    return null;
  };

  return (
    <>
      <MemberSearchPopup 
        isOpen={isMemberSearchOpen} 
        onClose={() => setIsMemberSearchOpen(false)} 
        members={membersDB} 
        onSelectMember={(m) => { setCurrentMember(m); setIsMemberSearchOpen(false); }} 
        onOpenNewMember={() => setIsNewMemberOpen(true)}
      />
      <NewMemberPopup 
        isOpen={isNewMemberOpen} 
        onClose={() => setIsNewMemberOpen(false)} 
      />
      <GlobalDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        currentView={currentView} 
        onNavigate={handleNavigate} 
      />
      
      {renderContent()}
    </>
  );
};

export default App;