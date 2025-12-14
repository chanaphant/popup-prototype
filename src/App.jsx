import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  // Layout & Navigation
  LayoutDashboard, Store, Calendar, CalendarDays, Users, Package, Tag, Receipt, Settings, HelpCircle,
  Home, Menu, LogOut, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowLeft,
  
  // Actions & UI
  Search, Plus, Minus, X, Check, Save, Edit, Edit2, Trash2, RefreshCcw, RefreshCw, 
  Download, Upload, Share2, Copy, Printer, Scan, Filter, MoreHorizontal, Power,
  
  // Status & Feedback
  Bell, CheckCircle, CheckCircle2, AlertCircle, AlertTriangle, Lock, Unlock, ShieldCheck, 
  Ban, XCircle, CheckSquare, Square, Star, Heart, Zap, Award, Trophy,
  
  // Objects & Entities
  Smartphone, FileText, CreditCard, Wallet, QrCode, Coins, Banknote, Truck, 
  ShoppingBasket, ShoppingCart, Camera, Globe, MapPin,
  
  // Animals & Grooming
  Dog, Cat, Rabbit, Fish, Bird, PawPrint, Scissors, Activity, HeartPulse, Hexagon,
  
  // Business & Data
  TrendingUp, Percent, Database, FileBarChart, FileSearch, Briefcase, SlidersHorizontal, 
  FileCheck, ClipboardCheck, FileInput, FileOutput, List, Grid,
  
  // Communication & People
  MessageSquare, MessageCircle, Mail, Megaphone, User, UserCheck, Contact,
  
  // Time
  Clock, Clock3, ClockIcon, History,
  
  // Renamed Imports (to avoid conflicts)
  Map as MapIcon, 
  Calendar as CalendarIcon, 
  Image as ImageIcon, 
  Link as LinkIcon
} from 'lucide-react';

// ==========================================
// ZONE A: SSOT (Single Source of Truth)
// Mock Data, Constants, and Configs
// ==========================================

const FONTS = {
  header: "font-['Prompt',_sans-serif]",
  body: "font-['Sarabun',_sans-serif]"
};

const SYSTEM_DEFAULTS = {
  shopName: 'Pet Omni Store',
  branch: 'สาขาหลัก (Main)',
  taxRate: 0.07,
  currency: 'THB',
  currencySymbol: '฿'
};

// --- ANIMAL BREEDS DATA FOR AUTOCOMPLETE ---
const ANIMAL_BREEDS_DATA = {
    dog: [
        'Golden Retriever', 'Labrador Retriever', 'Poodle', 'French Bulldog', 'Bulldog', 'Beagle', 'Pug', 'Rottweiler', 
        'German Shepherd', 'Dachshund', 'Siberian Husky', 'Chihuahua', 'Shih Tzu', 'Pomeranian', 'Corgi', 'Shiba Inu', 
        'Bangkeaw (บางแก้ว)', 'Thai Ridgeback (ไทยหลังอาน)', 'Yorkshire Terrier', 'Maltese'
    ],
    cat: [
        'Persian', 'Scottish Fold', 'Siamese (วิเชียรมาศ)', 'British Shorthair', 'Maine Coon', 'American Shorthair', 
        'Exotic Shorthair', 'Ragdoll', 'Sphynx', 'Bengal', 'Khao Manee (ขาวมณี)', 'Korat (โคราช)', 'Munchkin'
    ],
    rabbit: [
        'Holland Lop', 'Netherland Dwarf', 'Mini Rex', 'Lionhead', 'Flemish Giant', 'English Lop', 'New Zealand White', 'Thai Native (ไทยผสม)'
    ],
    bird: ['Parrot', 'Canary', 'Finch', 'Cockatiel', 'Lovebird', 'Sun Conure'],
    fish: ['Goldfish', 'Betta', 'Guppy', 'Koi', 'Flowerhorn'],
    rodent: ['Hamster', 'Guinea Pig', 'Chinchilla', 'Sugar Glider'],
    reptile: ['Iguana', 'Gecko', 'Tortoise', 'Snake']
};

// --- MOCK DATA FOR THAI ADDRESSES ---
const THAI_ADDRESS_MOCK = [
  { postcode: '10500', province: 'กรุงเทพมหานคร', district: 'บางรัก', subDistrict: ['สีลม', 'มหาพฤฒาราม', 'สีพระยา', 'บางรัก', 'สี่พระยา'] },
  { postcode: '10110', province: 'กรุงเทพมหานคร', district: 'คลองเตย', subDistrict: ['คลองเตย', 'คลองตัน', 'พระโขนง'] },
  { postcode: '10110', province: 'กรุงเทพมหานคร', district: 'วัฒนา', subDistrict: ['คลองเตยเหนือ', 'คลองตันเหนือ', 'พระโขนงเหนือ'] },
  { postcode: '10330', province: 'กรุงเทพมหานคร', district: 'ปทุมวัน', subDistrict: ['รองเมือง', 'วังใหม่', 'ปทุมวัน', 'ลุมพินี'] },
  { postcode: '10900', province: 'กรุงเทพมหานคร', district: 'จตุจักร', subDistrict: ['ลาดยาว', 'เสนานิคม', 'จันทรเกษม', 'จอมพล', 'จตุจักร'] },
  { postcode: '50200', province: 'เชียงใหม่', district: 'เมืองเชียงใหม่', subDistrict: ['หายยา', 'ช้างคลาน', 'ป่าแดด', 'หนองหอย'] },
  { postcode: '20150', province: 'ชลบุรี', district: 'บางละมุง', subDistrict: ['หนองปรือ', 'นาเกลือ', 'ห้วยใหญ่'] },
  { postcode: '12120', province: 'ปทุมธานี', district: 'คลองหลวง', subDistrict: ['คลองหนึ่ง', 'คลองสอง', 'คลองสาม'] },
];

// --- PRODUCT DATA ---
const PetProductsDB = [
  { id: 'P001', sku: 'D-001', barcode: '8851234567890', name: 'อาหารสุนัข สูตร 1', brand: 'Royal Canin', supplier: 'Royal Canin Thailand', category: 'Food', subCategory: 'Dry Food', stock: 150, stockPolicy: { min: 10, max: 50 }, unit: 'ลัง', price: 2700, cost: 2280, shelfLife: '90 วัน', animal: 'dog', img: '🐶', type: 'product', tags: ['best_seller'], packDetail: '6 ถุง/ลัง', description: 'สูตรเฉพาะสำหรับสุนัขโตเต็มวัย ช่วยดูแลสุขภาพผิวหนังและเส้นขน โปรตีนคุณภาพสูง' },
  { id: 'P002', sku: 'C-012', barcode: '8859876543210', name: 'ขนมแมวเลีย รสทูน่า', brand: 'Me-O', supplier: 'Perfect Companion', category: 'Food', subCategory: 'Snack', stock: 8, stockPolicy: { min: 20, max: 100 }, unit: 'แพ็ค', price: 300, cost: 216, shelfLife: '15 วัน', animal: 'cat', img: '🐱', type: 'product', tags: ['best_seller'], packDetail: '12 ซอง/แพ็ค', description: 'ทำจากเนื้อปลาทูน่าแท้ อุดมไปด้วยทอรีน บำรุงสายตา รสชาติอร่อยถูกใจ' },
  { id: 'P003', sku: 'S-005', barcode: '8854567890123', name: 'แชมพูสุนัข สูตรอ่อนโยน', brand: 'Generic', supplier: 'Pet Care Supply', category: 'Care', subCategory: 'Shampoo', stock: 0, stockPolicy: { min: 5, max: 30 }, unit: 'ขวด', price: 120, cost: 80, shelfLife: '-', animal: 'dog', img: '🧴', type: 'product', tags: [], packDetail: null, description: 'สูตร Hypoallergenic ไม่ระคายเคืองผิว กลิ่นหอมติดทนนาน ผขนนุ่มลื่น' },
  { id: 'P004', sku: 'A-033', barcode: '8850011223344', name: 'ปลอกคอแมว นิรภัย', brand: 'Generic', supplier: 'Pet Accessories Co.', category: 'Accessory', subCategory: 'Collar', stock: 42, stockPolicy: { min: 10, max: 50 }, unit: 'ชิ้น', price: 89, cost: 40, shelfLife: '120+ วัน', animal: 'cat', img: '🎀', type: 'product', tags: ['new_arrival'], packDetail: null, description: 'วัสดุนุ่มสบายไม่บาดคอ ปลอดภัยด้วยตัวล็อคนิรภัย (Safety Buckle) หลุดเองได้เมื่อติดขัด' },
  { id: 'P005', sku: 'T-009', barcode: '8857788990011', name: 'ของเล่นสุนัข ยางกัด', brand: 'Kong', supplier: 'Global Pet Toys', category: 'Toy', subCategory: 'Chew Toy', stock: 25, stockPolicy: { min: 5, max: 20 }, unit: 'ชิ้น', price: 150, cost: 90, shelfLife: '75 วัน', animal: 'dog', img: '🦴', type: 'product', tags: [], packDetail: null, description: 'ผลิตจากยางธรรมชาติ 100% ทนทานต่อการกัดแทะ ช่วยขัดฟันและลดความเครียด' },
  { id: 'P006', sku: 'L-001', barcode: '8853344556677', name: 'ทรายแมว 5L กลิ่นมะนาว', brand: 'Kasty', supplier: 'Kasty Thailand', category: 'Care', subCategory: 'Litter', stock: 12, stockPolicy: { min: 10, max: 40 }, unit: 'ถุง', price: 180, cost: 120, shelfLife: '20 วัน', animal: 'cat', img: '🚽', type: 'product', tags: ['best_seller'], packDetail: null, description: 'ผลิตจากมันสำปะหลังธรรมชาติ จับตัวเป็นก้อนเร็ว เก็บกลิ่นดีเยี่ยม ย่อยสลายได้' },
  { id: 'P007', sku: 'F-101', barcode: '8859988776655', name: 'อาหารปลาทอง เร่งสี', brand: 'Sakura', supplier: 'Aqua Feed', category: 'Food', subCategory: 'Pellet', stock: 30, stockPolicy: { min: 10, max: 50 }, unit: 'กล่อง', price: 720, cost: 420, shelfLife: '180 วัน', animal: 'fish', img: '🐟', type: 'product', tags: [], packDetail: '12 ซอง/กล่อง', description: 'สูตรเร่งสีสวยสดใสตามธรรมชาติ น้ำไม่ขุ่น โปรตีนสูงช่วยการเจริญเติบโต' },
  { id: 'P008', sku: 'R-202', barcode: '8852233445566', name: 'หญ้าแห้งกระต่าย Alfalfa', brand: 'Alfalfa King', supplier: 'Rabbit Lovers', category: 'Food', subCategory: 'Hay', stock: 10, stockPolicy: { min: 15, max: 60 }, unit: 'แพ็ค', price: 220, cost: 150, shelfLife: '60 วัน', animal: 'rabbit', img: '🐰', type: 'product', tags: [], packDetail: null, description: 'หญ้าอัลฟัลฟ่าเกรดพรีเมียม ใบเยอะ ก้านอ่อน กลิ่นหอม ไฟเบอร์สูง ช่วยระบบย่อยอาหาร' },
  { id: 'P009', sku: 'M-001', barcode: '8851122334455', name: 'Frontline Plus Dog (10-20kg)', brand: 'Frontline', supplier: 'Boehringer Ingelheim', category: 'Medicine', subCategory: 'Flea & Tick', stock: 18, stockPolicy: { min: 5, max: 20 }, unit: 'กล่อง', price: 890, cost: 600, shelfLife: '365 วัน', animal: 'dog', img: '💉', type: 'product', tags: ['new_arrival'], packDetail: '3 หลอด/กล่อง', description: 'ผลิตภัณฑ์กำจัดเห็บหมัด ตัวอ่อน และไข่ ตัดวงจรการแพร่พันธุ์ ปลอดภัยต่อสุนัข' },
  { id: 'P010', sku: 'B-055', barcode: '8856677889900', name: 'เบาะนอนสุนัข นุ่มพิเศษ L', brand: 'Sleepy Pet', supplier: 'Pet Bed Factory', category: 'Accessory', subCategory: 'Bedding', stock: 5, stockPolicy: { min: 3, max: 15 }, unit: 'ชิ้น', price: 890, cost: 500, shelfLife: '-', animal: 'dog', img: '🛏️', type: 'product', tags: ['new_arrival'], packDetail: null, description: 'เบาะนอนขนาดใหญ่พิเศษ บุด้วยใยสังเคราะห์เกรด A นุ่ม ฟู คืนตัวได้ดี ซักทำความสะอาดง่าย' },
];

// --- GROOMING DATA ---
const GROOMING_SERVICES_MOCK = [
  { id: 'S001', name: 'อาบน้ำ - สุนัขเล็ก (S) <5kg', duration: 60, price: 300, type: 'dog', category: 'Bath' },
  { id: 'S002', name: 'อาบน้ำ - สุนัขกลาง (M) 5-15kg', duration: 90, price: 450, type: 'dog', category: 'Bath' },
  { id: 'S003', name: 'ตัดขน - สุนัขเล็ก (S) <5kg', duration: 90, price: 500, type: 'dog', category: 'Cut' },
  { id: 'S004', name: 'ตัดขน - สุนัขกลาง (M) 5-15kg', duration: 120, price: 700, type: 'dog', category: 'Cut' },
  { id: 'S006', name: 'อาบน้ำ - แมว (S)', duration: 60, price: 400, type: 'cat', category: 'Bath' },
  { id: 'S008', name: 'สปาโคลนหมักขน', duration: 30, price: 200, type: 'spa', category: 'Spa' },
];

const GROOMERS = [
  { 
    id: 'G01', 
    name: 'ช่างแนน', 
    nickname: 'Nan',
    color: 'bg-pink-100 border-pink-200 text-pink-700',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    awards: ['แชมป์ตัดขนสไตล์เกาหลี 2023', 'ขวัญใจมหาชน'],
    skills: ['สุนัขเล็ก', 'Poodle Style', 'ทำสี', 'งานละเอียด'],
    stats: { beauty: 5, neatness: 4.8, care: 5, speed: 3.5, service: 4.9 },
    reviewsCount: 128,
    rating: 4.9,
    commissionRate: 40,
    schedule: 'Mon-Fri'
  },
  { 
    id: 'G02', 
    name: 'ช่างบอย', 
    nickname: 'Boy',
    color: 'bg-blue-100 border-blue-200 text-blue-700',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80',
    awards: ['รองชนะเลิศ Creative Grooming'],
    skills: ['สุนัขใหญ่', 'แมวดุ', 'งานไถ', 'ตัดทรงมาตรฐาน'],
    stats: { beauty: 4.2, neatness: 4.5, care: 4.8, speed: 5, service: 4.5 },
    reviewsCount: 45,
    rating: 4.6,
    commissionRate: 35,
    schedule: 'Tue-Sun'
  },
  { 
    id: 'G03', 
    name: 'ช่างก้อย', 
    nickname: 'Koi',
    color: 'bg-green-100 border-green-200 text-green-700',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    awards: [],
    skills: ['อาบน้ำ', 'เป่าขน', 'สปา', 'ตัดเล็บ'],
    stats: { beauty: 3.8, neatness: 4.5, care: 4.9, speed: 4.0, service: 4.8 },
    reviewsCount: 12,
    rating: 4.5,
    commissionRate: 30,
    schedule: 'Weekend Only'
  },
];

const CUSTOMERS_MOCK = [
  { 
    id: 'C001', name: 'คุณสมชาย ใจดี', phone: '081-111-1111', 
    pet: { name: 'น้องถุงทอง', type: 'dog', breed: 'Golden Retriever', coat: 'ขนยาว', weight: 25, img: '🐕' },
    history: [
        { id: 'H001', date: '2023-12-10', service: 'อาบน้ำตัดขน', groomerId: 'G01', groomer: 'ช่างแนน', price: 1200, rating: 5, comment: 'ช่างมือเบามากค่ะ ตัดทรงเกาหลีสวย' },
        { id: 'H002', date: '2023-11-15', service: 'อาบน้ำ', groomerId: 'G02', groomer: 'ช่างบอย', price: 600, rating: 4, comment: 'สะอาดดีครับ' }
    ]
  },
  { 
    id: 'C002', name: 'คุณวิภา รักสัตว์', phone: '089-999-9999', 
    pet: { name: 'มีมี่', type: 'cat', breed: 'Persian', coat: 'ขนยาวหนา', weight: 4.5, img: '🐈' },
    history: [
        { id: 'H003', date: '2023-12-05', service: 'ตัดขนแมว', groomerId: 'G02', groomer: 'ช่างบอย', price: 800, rating: 5, comment: 'น้องไม่กลัวเลย ช่างเก่งมาก' }
    ]
  },
  {
    id: 'C003', name: 'คุณอาทิตย์', phone: '085-555-5555',
    pet: { name: 'เจ้าบารอน', type: 'dog', breed: 'French Bulldog', coat: 'ขนสั้น', weight: 12, img: '🐶' },
    history: [
        { id: 'H004', date: '2023-12-01', service: 'อาบน้ำ', groomerId: 'G01', groomer: 'ช่างแนน', price: 400, rating: 5, comment: 'หอมฟุ้งเลยครับ' }
    ]
  }
];

const INITIAL_APPOINTMENTS_DATA = [
  { 
    id: 'A001', 
    customerId: 'C001', 
    groomerId: 'G01', 
    serviceId: 'S003', 
    startTime: '10:00', 
    endTime: '12:00', 
    status: 'confirmed',
    note: 'แพ้แชมพูสูตรเย็น'
  },
  { 
    id: 'A002', 
    customerId: 'C002', 
    groomerId: 'G02', 
    serviceId: 'S006', 
    startTime: '13:00', 
    endTime: '15:00', 
    status: 'completed',
    note: ''
  }
];

const WEIGHT_RANGES = [
  '(XS) <1 kg', 
  '(S) 1-3 kg', 
  '(M) 3-5 kg', 
  '(L) 5-8 kg', 
  '(XL) 8-12 kg', 
  '(2XL) 12-15 kg', 
  '(3XL) 15-25 kg', 
  '(4XL) 25-40 kg'
];

const SERVICE_TYPES_MATRIX = [
    { id: 'bath_short', label: 'อาบน้ำ - ขนสั้น', category: 'Bath' },
    { id: 'bath_long', label: 'อาบน้ำ - ขนยาว', category: 'Bath' },
    { id: 'bath_double', label: 'อาบน้ำ - ขน 2 ชั้น', category: 'Bath' },
    { id: 'cut_short', label: 'ตัดขนสั้น (Short Clip)', category: 'Cut' },
    { id: 'cut_sciss', label: 'ตัดซอย/กรรไกร (Scissor Cut)', category: 'Cut' },
    { id: 'spa', label: 'สปา (Spa)', category: 'Spa' },
];

// --- PURCHASING & SALES DATA ---
const MOCK_PURCHASE_ORDERS = [
    { id: 'PO-202406-003', date: '12/06/2024', supplier: 'Royal Canin Thailand', total: 13680, status: 'Pending', isSent: false, items: [
        { ...PetProductsDB[0], qty: 6 }
    ]},
    { id: 'PO-202406-002', date: '11/06/2024', supplier: 'Perfect Companion', total: 6480, status: 'Received', isSent: true, items: [
        { ...PetProductsDB[1], qty: 30 }
    ]},
    { id: 'PO-202406-001', date: '10/06/2024', supplier: 'Pet Care Supply', total: 2400, status: 'Cancelled', isSent: false, items: [
        { ...PetProductsDB[2], qty: 30 }
    ]},
    { id: 'PO-202405-099', date: '30/05/2024', supplier: 'Boehringer Ingelheim', total: 12000, status: 'Completed', isSent: true, items: [
        { ...PetProductsDB[8], qty: 20 }
    ]}
];

const MOCK_GOODS_RECEIPTS = [
    { id: 'GR-202406-001', poId: 'PO-202406-002', date: '14/06/2024', supplier: 'Perfect Companion', totalItems: 30, status: 'Pending Inspection', items: [ { ...PetProductsDB[1], qty: 30 } ] },
    { id: 'GR-202405-008', poId: 'PO-202405-099', date: '01/06/2024', supplier: 'Boehringer Ingelheim', totalItems: 20, status: 'Completed', items: [ { ...PetProductsDB[8], qty: 20 } ] },
];

const MOCK_INVOICES = [
    { id: 'INV-202406-055', grId: 'GR-202406-001', supplier: 'Perfect Companion', date: '2024-06-15', dueDate: '15/07/2024', amount: 6480, status: 'Unpaid' },
    { id: 'INV-202405-102', grId: 'GR-202405-008', supplier: 'Boehringer Ingelheim', date: '2024-06-02', dueDate: '02/07/2024', amount: 12000, status: 'Unpaid' },
    { id: 'INV-202406-011', grId: 'GR-202406-010', supplier: 'Royal Canin Thailand', date: '2024-06-10', dueDate: '10/07/2024', amount: 25000, status: 'Unpaid' },
    { id: 'INV-202406-015', grId: 'GR-202406-012', supplier: 'Royal Canin Thailand', date: '2024-06-12', dueDate: '12/07/2024', amount: 13680, status: 'Unpaid' },
];

const SALES_HISTORY_DB = [
  { id: 'INV-2567-001', date: '10/06/2024', time: '14:30', member: 'คุณ สมชาย ใจดี', pet: 'หมูตุ๋น', items: 3, total: 1250.00, method: 'Cash', status: 'Completed', cashier: 'Somying', details: [{name: 'อาหารสุนัข สูตร 1', qty: 2, price: 450}, {name: 'ขนมแมวเลีย', qty: 1, price: 350}] },
  { id: 'INV-2567-002', date: '10/06/2024', time: '15:45', member: 'ทั่วไป (Walk-in)', pet: null, items: 1, total: 450.00, method: 'QR PromptPay', status: 'Completed', cashier: 'Somying', details: [{name: 'อาหารสุนัข สูตร 1', qty: 1, price: 450}] },
  { id: 'INV-2567-003', date: '11/06/2024', time: '09:15', member: 'คุณ วิภา รักสัตว์', pet: 'มาร์นี่', items: 5, total: 3420.00, method: 'Credit Card', status: 'Voided', cashier: 'Somchai', details: [{name: 'Frontline Plus', qty: 2, price: 890}, {name: 'เบาะนอนสุนัข', qty: 1, price: 890}, {name: 'ทรายแมว', qty: 2, price: 180}] },
  { id: 'INV-2567-004', date: '11/06/2024', time: '11:20', member: 'คุณ บาส', pet: 'โอเลี้ยง', items: 2, total: 890.00, method: 'Cash', status: 'Completed', cashier: 'Somying', details: [{name: 'อาหารสุนัข สูตร 1', qty: 1, price: 450}, {name: 'ปลอกคอแมว', qty: 5, price: 88}] },
  { id: 'INV-2567-005', date: '11/06/2024', time: '13:00', member: 'คุณ จอย', pet: 'สโนว์บอล', items: 4, total: 2150.00, method: 'QR PromptPay', status: 'Returned', cashier: 'Somying', details: [{name: 'หญ้าแห้งกระต่าย', qty: 5, price: 220}, {name: 'อาหารปลาทอง', qty: 1, price: 60}] },
];

const MOCK_GROOMING_HISTORY = [
  { id: 1, date: '10/12/2023', branch: 'สาขาหลัก', service: 'อาบน้ำ - สุนัขเล็ก', amount: 350, note: 'น้องดื้อนิดหน่อย' },
  { id: 2, date: '15/11/2023', branch: 'สาขาหลัก', service: 'ตัดขน - สุนัขเล็ก', amount: 600, note: '-' },
  { id: 3, date: '01/10/2023', branch: 'สาขาหลัก', service: 'อาบน้ำตัดขน - สุนัขเล็ก', amount: 800, note: 'เปลี่ยนทรงขน' },
];

// --- MARKETPLACE & MEMBERS ---
const MARKETPLACE_BANNERS = [
  { id: 1, title: 'Royal Canin Super Brand Day', sub: 'ลดต้นทุนสูงสุด 15% เมื่อสั่งยกลัง', color: 'bg-gradient-to-r from-red-600 to-red-400', icon: '👑' },
  { id: 2, title: 'New Arrival: Tech Toys', sub: 'ของเล่นอัจฉริยะนำเข้าจากญี่ปุ่น กำไรดี', color: 'bg-gradient-to-r from-blue-600 to-indigo-400', icon: '🤖' },
  { id: 3, title: 'Summer Collection Sale', sub: 'เสื้อผ้าสัตว์เลี้ยงรับหน้าร้อน เริ่มต้น ฿40', color: 'bg-gradient-to-r from-orange-500 to-yellow-400', icon: '☀️' },
];

const MARKETPLACE_CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', icon: '🏢' },
  { id: 'best', name: 'ขายดี', icon: '🔥' },
  { id: 'new', name: 'มาใหม่', icon: '✨' },
  { id: 'food', name: 'อาหารสัตว์', icon: '🍖' },
  { id: 'med', name: 'เวชภัณฑ์', icon: '💉' },
  { id: 'acc', name: 'อุปกรณ์', icon: '🧶' },
];

const PetsDB = [
  { id: 'PET001', name: 'หมูตุ๋น', gender: 'Male', weight: 28.5, birthYear: 2020, type: 'dog', breed: 'Golden Retriever', coatType: 'ขนยาว', chronicDiseases: ['โรคข้อสะโพก'], ownerName: 'คุณ สมชาย ใจดี', phone: '081-111-1111', lineId: '@somchai' },
  { id: 'PET002', name: 'มาร์นี่', gender: 'Female', weight: 4.2, birthYear: 2021, type: 'cat', breed: 'Persian', coatType: 'ขนยาว', chronicDiseases: ['ทำหมันแล้ว'], ownerName: 'คุณ วิภา รักสัตว์', phone: '089-222-2222', lineId: '@vipa_cat' },
  { id: 'PET003', name: 'โอเลี้ยง', gender: 'Male', weight: 5.5, birthYear: 2019, type: 'dog', breed: 'Poodle', coatType: 'ขนหยิก', chronicDiseases: ['โรคผิวหนัง'], ownerName: 'คุณ บาส', phone: '083-456-7890', lineId: null },
  { id: 'PET004', name: 'สโนว์บอล', gender: 'Female', weight: 1.8, birthYear: 2022, type: 'rabbit', breed: 'Holland Lop', coatType: 'ขนสั้น', chronicDiseases: [], ownerName: 'คุณ จอย', phone: '088-901-2345', lineId: 'joy_rabbit' },
  { id: 'PET005', name: 'รถถัง', gender: 'Male', weight: 22.0, birthYear: 2018, type: 'dog', breed: 'Bulldog', coatType: 'ขนสั้น', chronicDiseases: ['โรคระบบทางเดินหายใจ', 'โรคหัวใจ'], ownerName: 'คุณ เอ', phone: '085-678-9012', lineId: 'mr_a' },
  { id: 'PET006', name: 'ศรีตรัง', gender: 'Female', weight: 3.5, birthYear: 2020, type: 'cat', breed: 'Siamese', coatType: 'ขนสั้น', chronicDiseases: ['ทำหมันแล้ว'], ownerName: 'คุณ แป้ง', phone: '084-567-8901', lineId: 'pang_jung' },
  { id: 'PET007', name: 'ริชชี่', gender: 'Male', weight: 0.05, birthYear: 2023, type: 'fish', breed: 'Goldfish', coatType: '-', chronicDiseases: [], ownerName: 'คุณ มารวย', phone: '087-890-1234', lineId: 'rich_fish' },
  { id: 'PET008', name: 'เขียวหวาน', gender: 'Male', weight: 0.1, birthYear: 2021, type: 'bird', breed: 'Parrot', coatType: 'ขน', chronicDiseases: [], ownerName: 'คุณ จอย', phone: '088-901-2345', lineId: 'joy_rabbit' },
  { id: 'PET009', name: 'ตัวเล็ก', gender: 'Female', weight: 2.5, birthYear: 2017, type: 'dog', breed: 'Chihuahua', coatType: 'ขนสั้น', chronicDiseases: ['โรคหัวใจ'], ownerName: 'คุณ สมชาย ใจดี', phone: '081-111-1111', lineId: '@somchai' },
  { id: 'PET010', name: 'ลูน่า', gender: 'Female', weight: 4.0, birthYear: 2022, type: 'cat', breed: 'Scottish Fold', coatType: 'ขนสั้น', chronicDiseases: ['นิ่ว'], ownerName: 'คุณ วิภา รักสัตว์', phone: '089-222-2222', lineId: '@vipa_cat' },
];

const INITIAL_MEMBERS_DB = [
  { id: '000', name: 'ลูกค้าทั่วไป (General)', nickname: '-', dob: '-', address: '-', phone: '000', level: 'ทั่วไป', levelColor: 'bg-gray-100 text-gray-500', points: 0, pets: [], petIds: [], line: false, theme: 'slate', visits: 0 },
  { id: '0811111111', name: 'คุณ สมชาย ใจดี', nickname: 'ชาย', dob: '12/05/1985', address: '123 แขวงคลองเตย เขตคลองเตย จังหวัดกรุงเทพมหานคร 10110', phone: '081-111-1111', level: 'ก๊วนเพื่อนซี้', levelColor: 'bg-purple-100 text-purple-600', points: 1500, pets: ['dog', 'dog'], petIds: ['PET001', 'PET009'], line: true, theme: 'amber', visits: 12 },
  { id: '0892222222', name: 'คุณ วิภา รักสัตว์', nickname: 'วิ', dob: '30/09/1990', address: '456 แขวงดินแดง เขตดินแดง จังหวัดกรุงเทพมหานคร 10400', phone: '089-222-2222', level: 'ครอบครัวขนฟู', levelColor: 'bg-green-100 text-green-600', points: 4500, pets: ['cat', 'cat'], petIds: ['PET002', 'PET010'], line: true, theme: 'pink', visits: 8 },
  { id: '0834567890', name: 'คุณ บาส', nickname: 'บาส', dob: '15/02/1995', address: '789 แขวงจันทรเกษม เขตจตุจักร จังหวัดกรุงเทพมหานคร 10900', phone: '083-456-7890', level: 'คู่หูขนฟู', levelColor: 'bg-blue-100 text-blue-600', points: 9988, pets: ['dog'], petIds: ['PET003'], line: false, theme: 'blue', visits: 8 },
  { id: '0889012345', name: 'คุณ จอย', nickname: 'จอย', dob: '01/01/1988', address: '101 แขวงสามเสนใน เขตพญาไท จังหวัดกรุงเทพมหานคร 10400', phone: '088-901-2345', level: 'ก๊วนเพื่อนซี้', levelColor: 'bg-purple-100 text-purple-600', points: 500, pets: ['rabbit', 'bird'], petIds: ['PET004', 'PET008'], line: true, theme: 'green', visits: 2 },
  { id: '0856789012', name: 'คุณ เอ', nickname: 'เอ', dob: '22/11/1992', address: '222 แขวงสวนหลวง เขตสวนหลวง จังหวัดกรุงเทพมหานคร 10250', phone: '085-678-9012', level: 'คู่หูขนฟู', levelColor: 'bg-blue-100 text-blue-600', points: 9033, pets: ['dog'], petIds: ['PET005'], line: true, theme: 'indigo', visits: 3 },
  { id: '0845678901', name: 'คุณ แป้ง', nickname: 'แป้ง', dob: '14/07/1998', address: '333 แขวงสีกัน เขตดอนเมือง จังหวัดกรุงเทพมหานคร 10210', phone: '084-567-8901', level: 'คู่หูขนฟู', levelColor: 'bg-blue-100 text-blue-600', points: 8988, pets: ['cat'], petIds: ['PET006'], line: true, theme: 'pink', visits: 12 },
  { id: '0878901234', name: 'คุณ มารวย', nickname: 'รวย', dob: '05/05/1980', address: '999 แขวงสัมพันธวงศ์ เขตสัมพันธวงศ์ จังหวัดกรุงเทพมหานคร 10100', phone: '087-890-1234', level: 'ผู้พิทักษ์', levelColor: 'bg-gray-100 text-gray-600', points: 250, pets: ['fish'], petIds: ['PET007'], line: true, theme: 'amber', visits: 0 },
];

const INITIAL_CART_ITEMS = [
  { id: 1, name: 'Royal Canin Maxi Adult อาหารสุนัขพันธุ์ใหญ่', price: 2200, discount: 220, stock: 25, promo: '10% OFF', qty: 1, unit: 'ถุง', code: 'RC', type: 'product' },
  { id: 2, name: 'Me-O Cat Food Tuna อาหารแมวรสทูน่า', price: 450, discount: 0, stock: 15, promo: null, qty: 2, unit: 'ถุง', code: 'Me-O', type: 'product' },
  { id: 3, name: 'SmartHeart Power Pack อาหารสุนัขพลังงานสูง', price: 1500, discount: 0, stock: 8, promo: null, qty: 1, unit: 'ถุง', code: 'SH', type: 'product' },
];

const RECOMMENDED_ITEMS = [
  { id: 101, name: 'Royal Canin Maxi Adult', price: 2200, code: 'RC', type: 'product' },
  { id: 102, name: 'Me-O Cat Food Tuna', price: 450, code: 'Me-O', type: 'product' },
  { id: 103, name: 'SmartHeart Power Pack', price: 1500, code: 'SH', type: 'product' },
  { id: 104, name: 'เบาะนอนสุนัข นุ่มพิเศษ', price: 890, code: 'BED', type: 'product' },
  { id: 105, name: 'แชมพูกำจัดเห็บหมัด', price: 350, code: 'SHA', type: 'product' },
  { id: 999, name: 'อาบน้ำตัดขน (S)', price: 450, code: 'SVC', type: 'service' }, // Added Service Item
  { id: 998, name: 'อาบน้ำตัดขน (L)', price: 800, code: 'SVC', type: 'service' }, // Added Service Item
];

const DRAWER_MENU_ITEMS = [
  { id: 'home', title: 'หน้าหลัก', icon: Home },
  { id: 'dashboard', title: 'แดชบอร์ด', icon: LayoutDashboard },
  { id: 'pos', title: 'POS ขายหน้าร้าน', icon: Store },
  { id: 'grooming', title: 'การจอง (Grooming)', icon: CalendarDays },
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
  { id: 'grooming', title: 'อาบน้ำ/ตัดขน', icon: CalendarDays, color: 'bg-[#065F46]', hover: 'hover:bg-[#087556]', accent: 'text-emerald-300' },
  { id: 'crm', title: 'สมาชิก CRM', icon: Users, color: 'bg-[#026AA7]', hover: 'hover:bg-[#037cc2]', accent: 'text-sky-300' },
  { id: 'purchasing', title: 'ซื้อสินค้า', icon: Package, color: 'bg-[#0F766E]', hover: 'hover:bg-[#138f85]', accent: 'text-teal-300' },
  { id: 'promo', title: 'โปรโมชั่น', icon: Tag, color: 'bg-[#BE123C]', hover: 'hover:bg-[#db1848]', accent: 'text-rose-300' },
  { id: 'expenses', title: 'ค่าใช้จ่าย', icon: Receipt, color: 'bg-[#15803D]', hover: 'hover:bg-[#199448]', accent: 'text-green-300' },
  { id: 'settings', title: 'ตั้งค่าร้าน', icon: Settings, color: 'bg-[#374151]', hover: 'hover:bg-[#4b5563]', accent: 'text-gray-300' },
  { id: 'help', title: 'ศูนย์ช่วยเหลือ', icon: HelpCircle, color: 'bg-[#C2410C]', hover: 'hover:bg-[#e04f12]', accent: 'text-orange-300' },
];

const PET_FILTER_BUTTONS = [ { type: 'dog', icon: '🐶' }, { type: 'cat', icon: '🐱' }, { type: 'rabbit', icon: '🐰' }, { type: 'bird', icon: '🦜' }, { type: 'fish', icon: '🐟' } ];
const PURCHASING_ANIMAL_FILTERS = [ { type: 'dog', icon: '🐶' }, { type: 'cat', icon: '🐱' }, { type: 'rabbit', icon: '🐰' }, { type: 'hamster', icon: '🐹' }, { type: 'bird', icon: '🦜' }, { type: 'fish', icon: '🐟' }, { type: 'turtle', icon: '🐢' }, { type: 'lizard', icon: '🦎' }, ];
const MEMBER_LEVEL_OPTIONS = ['ทั้งหมด', 'ก๊วนเพื่อนซี้', 'ครอบครัวขนฟู', 'คู่หูขนฟู', 'ผู้พิทักษ์'];

// --- End of ZONE A ---

// ==========================================
// ZONE E (Part 1): SHARED UTILS & LAYOUTS
// ==========================================

// --- CUSTOM UI: RADAR CHART (Used in Groomer Profile) ---
const RadarChart = ({ stats, color = "#4F46E5" }) => {
    if (!stats) return null;
    const size = 100;
    const center = size / 2;
    const radius = 40;
    const axes = Object.keys(stats);
    const total = axes.length;
    
    const points = axes.map((axis, i) => {
        const value = stats[axis] / 5; 
        const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
        const x = center + radius * value * Math.cos(angle);
        const y = center + radius * value * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    const bgPoints = axes.map((_, i) => {
        const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="relative w-full aspect-square max-w-[200px] mx-auto">
            <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
                <polygon points={bgPoints} fill="none" stroke="#E5E7EB" strokeWidth="1" />
                <polygon points={bgPoints} fill="#F3F4F6" opacity="0.5" transform={`scale(0.6) translate(${size*0.2}, ${size*0.2})`} />
                {axes.map((axis, i) => {
                      const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                      const x = center + (radius + 15) * Math.cos(angle);
                      const y = center + (radius + 15) * Math.sin(angle);
                      return (<text key={axis} x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-[6px] fill-gray-500 uppercase font-bold tracking-wider">{axis}</text>)
                })}
                <polygon points={points} fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
                {axes.map((axis, i) => {
                    const value = stats[axis] / 5;
                    const angle = (Math.PI * 2 * i) / total - Math.PI / 2;
                    const x = center + radius * value * Math.cos(angle);
                    const y = center + radius * value * Math.sin(angle);
                    return <circle key={i} cx={x} cy={y} r="1.5" fill={color} />
                })}
            </svg>
        </div>
    );
};

// --- SHARED: DROPDOWN FILTER ---
const SimpleDropdownFilter = ({ title, options, currentValue, setter }) => {
    const displayValue = currentValue === 'ALL' || currentValue === 'Custom' ? title : currentValue;
    const dropdownRef = useRef(null);
    const [isLocalOpen, setIsLocalOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLocalOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef]);
    
    return (
        <div className="relative shrink-0" ref={dropdownRef}>
            <button onClick={() => setIsLocalOpen(prev => !prev)} className={`flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 min-w-[140px] justify-between shadow-sm text-sm ${FONTS.header}`}><span>{displayValue}</span><ChevronDown size={14} className={`transition-transform ${isLocalOpen ? 'rotate-180' : ''}`}/></button>
            {isLocalOpen && (<div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">{options.map(option => (<button key={option} onClick={() => { setter(option); setIsLocalOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium ${currentValue === option ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}>{option}</button>))}</div>)}
        </div>
    );
};

// --- SHARED: PLACEHOLDER MODULE ---
const PlaceholderModule = ({ title, icon: Icon, handleNavigate, setIsDrawerOpen }) => (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
       <header className="bg-white shadow-sm h-16 flex items-center justify-between px-8 border-b border-emerald-100/50 sticky top-0 z-50">
        <div className="flex items-center gap-4"><button onClick={() => handleNavigate('home')} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500 hover:text-gray-800"><Home size={24} /></button><div className="h-6 w-px bg-gray-300 mx-2"></div><div className="flex items-center gap-3"><div className="p-2 bg-emerald-50 rounded-lg">{Icon ? <Icon className="text-emerald-700 w-6 h-6" /> : <Settings className="text-emerald-700 w-6 h-6" />}</div><h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>{title}</h1></div></div>
        <div className="flex items-center"><button onClick={() => setIsDrawerOpen(true)} className="p-2 hover:bg-gray-100 rounded-full"><Menu size={24} className="text-gray-500"/></button></div>
      </header>
      <div className="flex-1 p-8 flex items-center justify-center"><div className="text-center text-gray-400">{Icon ? <Icon size={64} className="mx-auto mb-4 opacity-50" /> : <Settings size={64} className="mx-auto mb-4 opacity-50" />}<h2 className="text-2xl font-bold">ระบบ {title}</h2><p>กำลังอยู่ในระหว่างการพัฒนา</p></div></div>
    </div>
);

// --- DASHBOARD WIDGETS (Stubbed for performance) ---
const SalesChart = ({ data }) => {
    // Logic
    const todayStr = '10/06/2024'; 
    const todayBills = data.filter(b => b.date === todayStr && b.status === 'Completed');
    const totalSales = todayBills.reduce((sum, b) => sum + b.total, 0);
    const target = 20000;
    const progress = Math.min((totalSales / target) * 100, 100);

    return (
        <div className="h-full relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-[#232329] to-[#141419] border border-white/5 shadow-2xl group">
            {/* Ambient Glow */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[60px] group-hover:bg-amber-500/30 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                    <div>
                        <p className={`${FONTS.header} text-amber-500/80 text-xs font-bold tracking-widest uppercase mb-1`}>Total Revenue</p>
                        <h3 className={`${FONTS.header} text-4xl font-bold text-white tracking-tight`}>
                            <span className="text-amber-400">฿</span>{totalSales.toLocaleString()}
                        </h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/20">
                        <TrendingUp size={20} className="text-black" />
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-medium text-gray-400">
                        <span>Target: ฿{target.toLocaleString()}</span>
                        <span className="text-amber-400">{progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-gray-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-yellow-200 rounded-full shadow-[0_0_15px_rgba(251,191,36,0.6)]" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ServiceQueue = ({ data }) => {
    const upcoming = data.filter(a => a.status !== 'completed').sort((a,b) => a.startTime.localeCompare(b.startTime)).slice(0, 3);

    return (
        <div className="h-full relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-[#232329] to-[#141419] border border-white/5 shadow-2xl">
            {/* Ambient Glow */}
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-600/20 rounded-full blur-[60px]"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`${FONTS.header} text-white font-bold flex items-center gap-2`}>
                        <span className="w-1 h-5 bg-purple-500 rounded-full"></span> คิวงาน
                    </h3>
                    <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 px-2 py-1 rounded-lg border border-purple-500/20">
                        {data.length} รอรับบริการ
                    </span>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                    {upcoming.map((app, i) => (
                        <div key={app.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors backdrop-blur-sm">
                            <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg text-white shrink-0">
                                <span className="text-[10px] font-bold">{app.startTime}</span>
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-200 truncate">{app.note || 'ลูกค้าทั่วไป'}</p>
                                <p className="text-[10px] text-gray-400">{app.serviceId}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const OrderList = ({ data }) => {
    const lowStockItems = data.filter(p => p.stock <= p.stockPolicy.min).slice(0, 4);

    return (
        <div className="h-full relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-[#232329] to-[#141419] border border-white/5 shadow-2xl">
            {/* Ambient Glow */}
            <div className="absolute -right-10 top-1/2 w-40 h-40 bg-rose-600/20 rounded-full blur-[60px]"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`${FONTS.header} text-white font-bold flex items-center gap-2`}>
                        <span className="w-1 h-5 bg-rose-500 rounded-full"></span> สต็อกวิกฤต
                    </h3>
                    <AlertTriangle size={18} className="text-rose-500 animate-pulse" />
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1">
                    {lowStockItems.map((p, i) => (
                        <div key={p.id} className="flex justify-between items-center p-2 rounded-lg border-b border-white/5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3 overflow-hidden">
                                <div className={`w-2 h-2 rounded-full shrink-0 ${p.stock===0 ? 'bg-red-500 shadow-[0_0_8px_red]' : 'bg-orange-500'}`}></div>
                                <span className="text-sm text-gray-300 truncate">{p.name}</span>
                            </div>
                            <span className="text-xs font-bold text-rose-400">{p.stock} {p.unit}</span>
                        </div>
                    ))}
                    {lowStockItems.length === 0 && <div className="text-center text-gray-500 text-xs mt-10">สต็อกปกติ</div>}
                </div>
            </div>
        </div>
    );
};

const MessageBox = ({ data }) => {
    const recentBills = data.slice(0, 4);

    return (
        <div className="h-full relative rounded-3xl p-6 overflow-hidden bg-gradient-to-br from-[#232329] to-[#141419] border border-white/5 shadow-2xl">
            {/* Ambient Glow */}
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-[60px]"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`${FONTS.header} text-white font-bold flex items-center gap-2`}>
                        <span className="w-1 h-5 bg-cyan-500 rounded-full"></span> ธุรกรรมล่าสุด
                    </h3>
                    <Receipt size={18} className="text-cyan-400" />
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1">
                    {recentBills.map(bill => (
                        <div key={bill.id} className="flex justify-between items-center py-2 border-b border-dashed border-gray-700/50 hover:bg-white/5 px-2 rounded transition-colors">
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-300">{bill.member}</span>
                                <span className="text-[10px] text-gray-500">{bill.time} • {bill.items} รายการ</span>
                            </div>
                            <span className="text-sm font-bold text-cyan-400">+{bill.total.toLocaleString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const MainMenuGrid = ({ onNavigate }) => (
  <div className="h-full flex flex-col">
    <div className="flex items-center gap-2 mb-4"><LayoutDashboard className="text-purple-400 w-6 h-6" /><h2 className={`${FONTS.header} text-white text-xl font-bold`}>เมนูหลัก</h2></div>
    <div className="grid grid-cols-3 gap-4 flex-1">{MAIN_MENUS.map((menu) => (<button key={menu.id} onClick={() => onNavigate(menu.id)} className={`${menu.color} ${menu.hover} rounded-3xl p-6 flex flex-col justify-center items-center gap-4 transition-all duration-300 transform hover:scale-[1.02] shadow-xl group`}><div className={`p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors`}><menu.icon size={40} className="text-white" /></div><span className={`${FONTS.header} text-white text-xl font-bold tracking-wide`}>{menu.title}</span></button>))}</div>
  </div>
);

// --- SHARED: POPUPS ---
const MemberSearchPopup = ({ isOpen, onClose, members, onSelectMember, onOpenNewMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  if (!isOpen) return null;
  const filtered = members ? members.filter(m => m.name.includes(searchTerm) || m.phone.includes(searchTerm)) : [];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div><div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200"><div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50"><div><h3 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ค้นหาสมาชิก</h3><p className={`${FONTS.body} text-sm text-gray-500`}>กรอกชื่อ หรือ เบอร์โทรศัพท์</p></div><button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X size={24} /></button></div><div className="p-6 pb-2"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" autoFocus placeholder="ค้นหาชื่อ, เบอร์โทร..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-lg`} /></div></div><div className="flex-1 overflow-y-auto p-4 custom-scrollbar">{filtered.length > 0 ? (<div className="space-y-2">{filtered.map(member => (<div key={member.id} onClick={() => onSelectMember(member)} className="p-4 rounded-xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition flex items-center justify-between group"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${member.theme === 'amber' ? 'bg-amber-400' : member.theme === 'purple' ? 'bg-purple-500' : member.theme === 'gray' ? 'bg-gray-400' : 'bg-slate-400'}`}>{member.name.charAt(4)}</div><div><h4 className={`${FONTS.header} font-bold text-gray-800`}>{member.name}</h4><p className={`${FONTS.body} text-sm text-gray-500 flex items-center gap-1`}><Smartphone size={12} /> {member.phone}</p></div></div><div className="text-right"><span className={`text-xs px-2 py-1 rounded-full font-bold ${member.levelColor || 'bg-gray-100 text-gray-600'}`}>{member.level}</span><p className="text-emerald-600 text-sm font-bold mt-1">{member.points.toLocaleString()} pts</p></div></div>))}</div>) : (<div className="flex flex-col items-center justify-center h-40 text-gray-400"><User size={48} className="mb-2 opacity-20" /><p>ไม่พบรายชื่อสมาชิก</p><button onClick={() => {onClose(); onOpenNewMember();}} className="mt-4 text-emerald-600 font-bold hover:underline">+ เพิ่มสมาชิกใหม่</button></div>)}</div></div></div>
  );
};

const NewMemberPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ phone: '', nickname: '', lineId: '', dogs: 0, cats: 0, rabbits: 0 });
  if (!isOpen) return null;
  const handleCounter = (type, op) => { setFormData(prev => ({ ...prev, [type]: op === 'inc' ? prev[type] + 1 : Math.max(0, prev[type] - 1) })); };
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div><div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"><div className="bg-emerald-600 p-6 text-white flex justify-between items-start"><div><h3 className={`${FONTS.header} text-2xl font-bold`}>สมาชิกใหม่</h3><p className={`${FONTS.body} text-emerald-100 text-sm opacity-90`}>กรอกข้อมูลเพื่อสมัครสมาชิกด่วน</p></div><button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"><X size={20} /></button></div><div className="p-6 space-y-5"><div className="space-y-4"><div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-1 block`}>เบอร์โทรศัพท์ (ใช้เป็น Member ID)</label><div className="relative"><Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" className={`${FONTS.header} w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition font-bold text-lg text-gray-800 tracking-wide`} placeholder="0XX-XXX-XXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div></div><div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-1 block`}>ชื่อเล่นลูกค้า</label><input type="text" className={`${FONTS.header} w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition`} placeholder="เช่น คุณเมย์, น้องจอย" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} /></div></div><div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-2 block`}>จำนวนน้องๆ ที่เลี้ยง</label><div className="grid grid-cols-3 gap-3">{[{ id: 'dogs', label: 'สุนัข', icon: '🐶', color: 'bg-orange-50 border-orange-200 text-orange-600' }, { id: 'cats', label: 'แมว', icon: '🐱', color: 'bg-blue-50 border-blue-200 text-blue-600' }, { id: 'rabbits', label: 'กระต่าย', icon: '🐰', color: 'bg-pink-50 border-pink-200 text-pink-600' }].map(pet => (<div key={pet.id} className={`flex flex-col items-center p-2 rounded-xl border ${pet.color} transition-all`}><span className="text-2xl mb-1">{pet.icon}</span><span className={`${FONTS.header} text-xs font-bold mb-2`}>{pet.label}</span><div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-black/5 px-1 py-1"><button onClick={() => handleCounter(pet.id, 'dec')} className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 transition">-</button><span className="font-bold text-gray-800 w-4 text-center text-sm">{formData[pet.id]}</span><button onClick={() => handleCounter(pet.id, 'inc')} className="w-6 h-6 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 transition">+</button></div></div>))}</div></div></div><div className="p-6 pt-0 flex gap-3"><button onClick={onClose} className={`${FONTS.header} flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition`}>ยกเลิก</button><button onClick={() => {alert('Added!'); onClose();}} className={`${FONTS.header} flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition active:scale-95`}>+ เพิ่มสมาชิก</button></div></div></div>
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

// ==========================================
// ZONE E (Part 1.5): SIDEBARS
// ==========================================

// ------------ SIDEBAR LAYOUT
const BaseSidebarLayout = ({ menuItems, activePage, onNavigate, onOpenDrawer, titleIcon: TitleIcon = Menu, title }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    
    // Theme Tokens
    const T_BG = 'bg-[#1E1E24]';
    const T_BORDER = 'border-gray-800';
    const T_TEXT = 'text-gray-400';
    const T_HOVER_BG = 'hover:bg-gray-800';
    const T_ACTIVE_BG = 'bg-[#FCD34D]';
    const T_ACTIVE_TEXT = 'text-gray-900';

    return (
        <div className="w-20 h-full relative z-40 shrink-0">
            <div className={`absolute top-0 left-0 h-full ${T_BG} shadow-xl transition-all duration-300 flex flex-col border-r ${T_BORDER} ${isExpanded ? 'w-64' : 'w-20'}`} 
                 onMouseEnter={() => setIsExpanded(true)} 
                 onMouseLeave={() => setIsExpanded(false)}>
                
                {/* Header (สำหรับ Grooming/Settings) */}
                {title && isExpanded && (
                     <div className="h-16 flex items-center px-6 border-b border-gray-800 bg-[#1E1E24]">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-lg bg-[#FCD34D] flex items-center justify-center text-gray-900 shadow-lg shadow-yellow-500/20">
                             <TitleIcon size={18} strokeWidth={2.5} />
                           </div>
                           <span className={`${FONTS.header} font-bold text-lg text-white block leading-none`}>{title}</span>
                        </div>
                     </div>
                )}
                
                {/* Main Menu Items (FIXED - 1) */}
                <div className="flex flex-col h-full py-4 px-3 flex-1 overflow-y-auto custom-scrollbar">
                    {menuItems.map((item, index) => {
                        // ใช้ item.id เป็น key, หรือ index ถ้า id ไม่มี
                        const key = item.id || index; 
                        const isActive = activePage === item.id;
                        // สำหรับ Menu Item ที่ไม่มี action/id เราให้ action เป็นการ navigate ไปที่ id นั้นๆ
                        const action = item.id === 'menu' ? onOpenDrawer : item.action || (() => item.id && onNavigate(item.id));
                        
                        if (item.bottom) return null;

                        return (
                            <div key={key} onClick={action} className={`relative flex items-center p-3 rounded-full mb-1 cursor-pointer transition-colors duration-200 
                                ${isActive 
                                   ? `${T_ACTIVE_BG} ${T_ACTIVE_TEXT} shadow-md` 
                                   : `${T_TEXT} ${T_HOVER_BG}` 
                                }
                                ${!isExpanded ? 'justify-center w-auto' : ''}`}>
                                
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-gray-900' : 'text-current'} />
                                
                                {/* Text Label */}
                                <span className={`ml-4 ${FONTS.header} font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'} ${isActive ? 'font-bold' : ''}`}>
                                    {item.label}
                                </span>
                                
                                {/* 1. Badge Text (EXPANDED) */}
                                {item.badge && isExpanded && (
                                    <span className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold bg-red-500 text-white`}>
                                        {item.badge}
                                    </span>
                                )}

                                {/* 2. Badge Dot (NOT EXPANDED) */}
                                {item.badge && !isExpanded && (
                                    <span 
                                        className={`absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 ${T_BG}`}
                                        title={item.label}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Bottom Items (LogOut/Settings) (FIXED - 2) */}
                <div className={`p-3 border-t ${T_BORDER} ${T_BG} flex flex-col`}>
                    {menuItems.filter(i => i.bottom).map(item => {
                        const key = item.id || item.label; // ใช้ label ถ้าไม่มี id
                        const action = item.action || (() => item.id && onNavigate(item.id));
                        return (
                           <div key={key} onClick={action} className={`relative flex items-center p-3 rounded-full mb-1 cursor-pointer transition-colors duration-200 ${T_TEXT} ${T_HOVER_BG} ${!isExpanded ? 'justify-center w-auto' : ''}`}>
                                <item.icon size={24} className={'text-current'} />
                                <span className={`ml-4 ${FONTS.header} font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isExpanded ? 'opacity-100 max-w-full' : 'opacity-0 max-w-0'}`}>{item.label}</span>
                           </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};


// POS Sidebar (Refactored)
const POSSidebar = ({ onOpenDrawer, onNavigate, activeTab, onTabChange }) => {
    const menuItems = [
        { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true },
        { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
        { icon: Store, label: 'ระบบขายหน้าร้าน', id: 'terminal', action: () => onTabChange('terminal') },
		{ icon: Users, label: 'ลูกค้า & CRM' },
		{ icon: Package, label: 'คลังสินค้า' },
        { icon: FileText, label: 'ประวัติบิล', id: 'history', action: () => onTabChange('history') },
        { icon: Receipt, label: 'ลิ้นชักเก็บเงิน', id: 'cashDrawer', action: () => onTabChange('cashDrawer') },
        { icon: Smartphone, label: 'พนักงานมือถือ' },
        { icon: CalendarDays, label: 'ตารางนัดหมาย' },
        { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activeTab} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />;
};

// CRM Sidebar (Refactored)
const CRMSidebar = ({ onOpenDrawer, onNavigate, activeTab, onTabChange }) => {
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true },
      { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
      { icon: Users, label: 'สมาชิก', id: 'members', action: () => onTabChange('members') },
      { icon: PawPrint, label: 'สัตว์เลี้ยง', id: 'pets', action: () => onTabChange('pets') },
      { icon: MessageCircle, label: 'Line OA', id: 'line_oa', action: () => onTabChange('line_oa') },
      { icon: Megaphone, label: 'BroadCast' },
      { icon: Settings, label: 'ตั้งค่า', id: 'settings', action: () => onTabChange('settings') },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activeTab} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />;
};

// Purchasing Sidebar (Refactored)
const PurchasingSidebar = ({ onOpenDrawer, onNavigate, activePage, onChangePage, cartItemCount, pendingCount }) => {
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true },
      { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
      { icon: LayoutDashboard, label: 'ภาพรวม', id: 'overview', active: true, action: () => onChangePage('overview') }, 
      { icon: Store, label: 'Marketplace', id: 'marketplace', action: () => onChangePage('marketplace') },
      { icon: ShoppingCart, label: 'ตะกร้า', id: 'cart', action: () => onChangePage('cart'), badge: cartItemCount > 0 ? cartItemCount : null },
      { icon: FileText, label: 'ใบสั่งซื้อ', id: 'purchase_orders', action: () => onChangePage('purchase_orders'), badge: pendingCount > 0 ? pendingCount : null },
      { icon: Truck, label: 'ใบรับสินค้า', id: 'goods_receipts', action: () => onChangePage('goods_receipts') },
      { icon: CreditCard, label: 'ชำระเงิน', id: 'payments', action: () => onChangePage('payments') },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activePage} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />;
};

// Grooming Sidebar (Refactored to Wrapper)
const GroomingSidebar = ({ onNavigate, activePage, onChangePage, onOpenDrawer }) => {
  const menuItems = [
    { icon: Scissors, label: 'Pet Salon', action: onOpenDrawer },
	{ icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
    { id: 'booking', icon: CalendarDays, label: 'ตารางนัดหมาย' },
    { id: 'clients', icon: Users, label: 'ประวัติลูกค้า' },
    { id: 'services', icon: Scissors, label: 'บริการ & ราคา' },
    { id: 'staff', icon: UserCheck, label: 'พนักงาน (Groomer)' },
    { id: 'settings', icon: Settings, label: 'ตั้งค่า Grooming', bottom: true },
    { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
  ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activePage} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />;
};

// Settings Sidebar (Refactored)
const SettingsSidebar = ({ onOpenDrawer, onNavigate, activePage, onChangePage }) => {
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true },
      { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
      { icon: Settings, label: 'ทั่วไป', id: 'general', active: true, action: () => onChangePage('general') },
      { icon: Users, label: 'ผู้ใช้งาน' },
      { icon: Database, label: 'จัดการข้อมูล' },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activePage} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} titleIcon={Settings} title="Settings" />;
};

// ==========================================
// ZONE E (Part 2): POS FEATURES
// ==========================================

// --- BILL HISTORY VIEW ---
const BillHistoryView = () => {
    // Local States
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const [timeRange, setTimeRange] = useState('Today');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const TIME_RANGES = ['Today', 'Yesterday', '3 Days Ago', '7 Days Ago', '30 Days Ago', 'Month', 'Last Month', '3 Months', 'Year', 'Last Year', 'Custom'];
    const STATUS_OPTIONS = ['ALL', 'Completed', 'Voided', 'Returned'];
    
    // Filter Logic
    const filteredBills = useMemo(() => {
        let bills = SALES_HISTORY_DB; // From Zone A
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            bills = bills.filter(bill => 
                bill.id.toLowerCase().includes(term) || 
                bill.member.toLowerCase().includes(term) ||
                (bill.pet && bill.pet.toLowerCase().includes(term)) ||
                (bill.details && bill.details.some(detail => detail.name.toLowerCase().includes(term)))
            );
        }
        if (statusFilter !== 'ALL') {
            bills = bills.filter(bill => bill.status === statusFilter);
        }
        if (timeRange !== 'ALL') {
            if (timeRange === 'Today') bills = bills.filter(bill => bill.date === '10/06/2024'); // Mock Date
        }
        return bills.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [searchTerm, statusFilter, timeRange]);

    const summary = useMemo(() => {
        const completedBills = filteredBills.filter(b => b.status === 'Completed' || b.status === 'Returned');
        const voidedBills = filteredBills.filter(b => b.status === 'Voided');
        const totalSales = completedBills.reduce((acc, b) => acc + b.total, 0);
        return { totalSales: totalSales, billCount: filteredBills.length, voidedBillCount: voidedBills.length };
    }, [filteredBills]);

    const SummaryCard = ({ title, value, icon: Icon, color }) => (
        <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100 flex items-center justify-between min-w-[200px]">
            <div><p className={`${FONTS.body} text-sm text-gray-500 font-medium`}>{title}</p><p className={`${FONTS.header} text-2xl font-bold text-gray-800 tabular-nums`}>{value}</p></div>
            <div className={`p-3 rounded-full ${color} text-white`}><Icon size={24} /></div>
        </div>
    );

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F3F4F6] overflow-hidden relative">
            <div className="h-24 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><History size={24} /></div>
                    <div><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ประวัติบิลขาย</h2><p className={`${FONTS.body} text-xs text-gray-400`}>ค้นหาและจัดการรายการขายย้อนหลัง</p></div>
                </div>
                <div className="flex gap-4">
                    <SummaryCard title="ยอดขายสุทธิ" value={`${SYSTEM_DEFAULTS.currencySymbol}${summary.totalSales.toLocaleString()}`} icon={TrendingUp} color="bg-emerald-500"/>
                    <SummaryCard title="จำนวนบิลทั้งหมด" value={summary.billCount.toLocaleString()} icon={FileText} color="bg-blue-500"/>
                    <SummaryCard title="บิลแคนเซิล (Void)" value={summary.voidedBillCount.toLocaleString()} icon={Ban} color="bg-rose-500"/>
                </div>
            </div>

            <div className="p-8 pb-4 shrink-0">
                <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="flex-1 relative min-w-[300px]">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input type="text" placeholder="ค้นหาเลขที่บิล, ชื่อลูกค้า, ชื่อสัตว์เลี้ยง..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition text-gray-700 text-sm`} />
                    </div>
                    <SimpleDropdownFilter title="ช่วงเวลา" options={TIME_RANGES} currentValue={timeRange} setter={setTimeRange}/>
                    <SimpleDropdownFilter title="สถานะบิล" options={STATUS_OPTIONS} currentValue={statusFilter} setter={setStatusFilter}/>
                    <button className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition flex items-center gap-2 text-sm"><Filter size={16} /> ขั้นสูง</button>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition flex items-center gap-2 text-sm ml-auto"><ArrowLeft size={16} /> เรียกคืนบิล</button>
                </div>
            </div>

            <div className="flex-1 p-8 pt-0 overflow-hidden">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-xs text-gray-500 uppercase">
                                <tr><th className="p-4 pl-6 font-bold">เลขที่บิล</th><th className="p-4 font-bold">วันที่ / เวลา</th><th className="p-4 font-bold">ลูกค้า / สัตว์เลี้ยง</th><th className="p-4 font-bold text-center">รายการ</th><th className="p-4 font-bold text-right">ยอดรวม</th><th className="p-4 font-bold text-center">ชำระโดย</th><th className="p-4 font-bold text-center">สถานะ</th><th className="p-4 font-bold text-center">พนักงาน</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {filteredBills.length > 0 ? (filteredBills.map((bill) => (
                                    <tr key={bill.id} onClick={() => setSelectedBill(bill)} className="hover:bg-blue-50/50 transition cursor-pointer group">
                                        <td className="p-4 pl-6 font-mono font-bold text-blue-600">{bill.id}</td>
                                        <td className="p-4 text-gray-600"><div className="font-bold">{bill.date}</div><div className="text-xs text-gray-400">{bill.time}</div></td>
                                        <td className="p-4 font-bold text-gray-800"><div>{bill.member}</div><div className="text-xs text-gray-500 font-medium italic">{bill.pet || 'N/A'}</div></td>
                                        <td className="p-4 text-center text-gray-600">{bill.items}</td>
                                        <td className="p-4 text-right font-bold text-gray-800">{SYSTEM_DEFAULTS.currencySymbol}{bill.total.toLocaleString()}</td>
                                        <td className="p-4 text-center"><span className="px-3 py-1 rounded-full bg-gray-100 text-xs font-bold text-gray-600">{bill.method}</span></td>
                                        <td className="p-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${bill.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : bill.status === 'Voided' ? 'bg-rose-100 text-rose-600' : 'bg-orange-100 text-orange-600'}`}>{bill.status}</span></td>
                                        <td className="p-4 text-center text-gray-500">{bill.cashier}</td>
                                    </tr>
                                ))) : (<tr><td colSpan="8" className="p-12 text-center text-gray-400"><div className="flex flex-col items-center justify-center"><FileSearch size={48} className="mb-4 opacity-30" /><p className={`${FONTS.header} text-lg font-medium`}>ไม่พบข้อมูลบิลที่ตรงกับเงื่อนไข</p></div></td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {selectedBill && (<><div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] z-40 transition-opacity" onClick={() => setSelectedBill(null)}></div><div className="absolute top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 flex flex-col"><div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50"><div><h3 className={`${FONTS.header} text-xl font-bold text-gray-800`}>รายละเอียดบิล</h3><p className="text-blue-600 font-mono font-bold text-sm">{selectedBill.id}</p></div><button onClick={() => setSelectedBill(null)} className="p-2 hover:bg-gray-200 rounded-full text-gray-500"><X size={20} /></button></div><div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6"><div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-100"><div className="flex justify-between"><span>วันที่:</span> <span className="font-bold">{selectedBill.date} {selectedBill.time}</span></div><div className="flex justify-between"><span>ลูกค้า:</span> <span className="font-bold">{selectedBill.member}</span></div><div className="flex justify-between"><span>พนักงาน:</span> <span className="font-bold">{selectedBill.cashier}</span></div><div className="flex justify-between"><span>ชำระโดย:</span> <span className="font-bold">{selectedBill.method}</span></div></div><div><h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><List size={16} /> รายการสินค้า</h4><div className="border border-gray-200 rounded-xl overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-100 text-gray-500"><tr><th className="p-3 text-left">สินค้า</th><th className="p-3 text-center">จำนวน</th><th className="p-3 text-right">ราคา</th></tr></thead><tbody className="divide-y divide-gray-100">{selectedBill.details && selectedBill.details.map((item, idx) => (<tr key={idx}><td className="p-3 text-gray-800">{item.name}</td><td className="p-3 text-center text-gray-600">x{item.qty}</td><td className="p-3 text-right font-bold text-gray-800">{(item.price * item.qty).toLocaleString()}</td></tr>))}</tbody><tfoot className="bg-emerald-50"><tr><td colSpan="2" className="p-3 text-right font-bold text-gray-600">ยอดรวมทั้งสิ้น</td><td className="p-3 text-right font-bold text-emerald-600 text-lg">{SYSTEM_DEFAULTS.currencySymbol}{selectedBill.total.toLocaleString()}</td></tr></tfoot></table></div></div></div><div className="p-6 border-t border-gray-100 bg-gray-50"><div className="grid grid-cols-2 gap-3 mb-3"><button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-100 text-orange-700 font-bold hover:bg-orange-200 transition"><RefreshCcw size={18} /> คืนสินค้า</button><button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-100 text-rose-700 font-bold hover:bg-rose-200 transition"><Ban size={18} /> คืนบิล (Void)</button></div><button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-gray-900 text-white font-bold hover:bg-black shadow-lg transition"><Printer size={20} /> พิมพ์ใบเสร็จ (80x80mm)</button></div></div></>)}
        </div>
    );
};

// --- CASH DRAWER VIEW ---
const CashDrawerView = ({ settings }) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isShiftOpen, setIsShiftOpen] = useState(true);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [showOpenCount, setShowOpenCount] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [pin, setPin] = useState('');
    const denominations = [1000, 500, 100, 50, 20, 10, 5, 2, 1];
    const [counts, setCounts] = useState(Object.fromEntries(denominations.map(d => [d, 0])));
    
    useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 1000); return () => clearInterval(timer); }, []);
    const totalCount = denominations.reduce((acc, d) => acc + (d * counts[d]), 0);
    const handleOpenShift = () => { setIsShiftOpen(true); setShowOpenCount(false); setCounts(Object.fromEntries(denominations.map(d => [d, 0]))); };
    const handleCloseShift = () => { setIsShiftOpen(false); setShowCloseConfirm(false); };
    const handleOpenDrawer = () => { if (pin === '1234') { setShowPinModal(false); setPin(''); } };

    return (
        <div className="flex-1 flex flex-col h-full bg-[#F3F4F6] overflow-hidden relative">
            <div className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0"><div className="flex items-center gap-4"><div className="bg-blue-50 p-2.5 rounded-xl text-blue-600"><Receipt size={24} /></div><div><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ลิ้นชักเก็บเงิน</h2><p className={`${FONTS.body} text-xs text-gray-400`}>จัดการกะ และ เงินสดในลิ้นชัก</p></div></div></div>
            <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                <div className="flex-[3] flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100"><div className="flex justify-between items-center mb-4"><h3 className={`${FONTS.header} font-bold text-gray-700`}>เป้าหมายวันนี้</h3><span className="text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">กำลังไปได้สวย!</span></div><div className="flex items-end gap-2 mb-2"><span className="text-4xl font-bold text-gray-800">฿12,500</span><span className="text-gray-400 mb-1">/ ฿20,000</span></div><div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden"><div className="bg-emerald-500 h-full rounded-full w-[62%] transition-all duration-1000"></div></div></div>
                    <div className="grid grid-cols-3 gap-4"><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><span className="text-gray-400 text-xs mb-1">ลูกค้าใหม่</span><span className="text-2xl font-bold text-blue-600">15%</span><div className="w-12 h-1 bg-blue-100 rounded-full mt-2"><div className="bg-blue-500 w-[15%] h-full rounded-full"></div></div></div><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><span className="text-gray-400 text-xs mb-1">ลูกค้าเก่า</span><span className="text-2xl font-bold text-purple-600">65%</span><div className="w-12 h-1 bg-purple-100 rounded-full mt-2"><div className="bg-purple-500 w-[65%] h-full rounded-full"></div></div></div><div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center"><span className="text-gray-400 text-xs mb-1">Walk-in</span><span className="text-2xl font-bold text-orange-600">20%</span><div className="w-12 h-1 bg-orange-100 rounded-full mt-2"><div className="bg-orange-500 w-[20%] h-full rounded-full"></div></div></div></div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex-1"><h3 className={`${FONTS.header} font-bold text-gray-700 mb-4`}>ยอดขาย: สินค้า vs บริการ</h3><div className="space-y-4"><div><div className="flex justify-between text-sm mb-1"><span>สินค้า (Products)</span><span className="font-bold">฿8,500</span></div><div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-blue-500 h-full rounded-full w-[70%]"></div></div></div><div><div className="flex justify-between text-sm mb-1"><span>บริการ (Services)</span><span className="font-bold">฿4,000</span></div><div className="w-full bg-gray-100 h-2 rounded-full"><div className="bg-orange-400 h-full rounded-full w-[30%]"></div></div></div></div></div>
                </div>
                <div className="flex-[2] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col"><div className="flex items-center gap-2 mb-6"><Bell className="text-red-500" /><h3 className={`${FONTS.header} font-bold text-gray-800 text-lg`}>การแจ้งเตือนสำคัญ</h3></div><div className="flex-1 overflow-y-auto custom-scrollbar space-y-3"><div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"><AlertCircle className="text-red-500 mt-1 shrink-0" size={18} /><div><h4 className="font-bold text-red-700 text-sm">สินค้าหมดสต็อก</h4><p className="text-red-600 text-xs">อาหารสุนัข สูตร 1 (RC) หมดแล้ว</p></div></div><div className="p-3 bg-orange-50 border border-orange-100 rounded-xl flex items-start gap-3"><AlertTriangle className="text-orange-500 mt-1 shrink-0" size={18} /><div><h4 className="font-bold text-orange-700 text-sm">สินค้าใกล้หมด</h4><p className="text-orange-600 text-xs">ทรายแมว Kasty เหลือ 3 ถุง</p></div></div><div className="p-3 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3"><Clock className="text-yellow-600 mt-1 shrink-0" size={18} /><div><h4 className="font-bold text-yellow-700 text-sm">แจ้งเตือนกะ</h4><p className="text-yellow-600 text-xs">พนักงาน Somying เข้ากะช้า 15 นาที</p></div></div><div className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-start gap-3"><FileText className="text-gray-500 mt-1 shrink-0" size={18} /><div><h4 className="font-bold text-gray-700 text-sm">แก้ไขบิล</h4><p className="text-gray-600 text-xs">บิล #INV-004 มีการแก้ไขรายการ</p></div></div><div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3"><Trash2 className="text-red-500 mt-1 shrink-0" size={18} /><div><h4 className="font-bold text-red-700 text-sm">ของเสีย / หมดอายุ</h4><p className="text-red-600 text-xs">พบสินค้าหมดอายุ 2 รายการในคลัง</p></div></div></div></div>
            </div>
            <div className="h-24 bg-white border-t border-gray-200 px-8 flex items-center justify-between shrink-0 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-20"><div className="flex items-center gap-4"><div className="text-right"><p className="text-xs text-gray-400 font-medium">เวลาปัจจุบัน</p><p className={`${FONTS.header} text-3xl font-bold text-gray-800 tabular-nums`}>{currentTime.toLocaleTimeString('th-TH')}</p></div></div><div className="flex items-center gap-4"><button onClick={() => setShowHistory(true)} className="px-6 py-3 rounded-xl text-blue-600 bg-blue-50 hover:bg-blue-100 font-bold transition flex items-center gap-2"><History size={20} /> ประวัติ เปิด/ปิดกะ</button><button onClick={() => setShowPinModal(true)} className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-600 hover:border-gray-800 hover:text-gray-900 font-bold transition flex items-center gap-2"><Unlock size={20} /> เปิดลิ้นชัก</button>{isShiftOpen ? (<button onClick={() => setShowCloseConfirm(true)} className="px-8 py-3 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-lg shadow-rose-200 transition flex items-center gap-2 transform active:scale-95"><Lock size={20} /> ปิดกะ (Close Shift)</button>) : (<button onClick={() => setShowOpenCount(true)} className="px-8 py-3 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-200 transition flex items-center gap-2 transform active:scale-95"><Lock size={20} className="text-emerald-200" /> เปิดกะ (Open Shift)</button>)}</div></div>
            {showCloseConfirm && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in duration-200 text-center"><AlertTriangle className="mx-auto text-rose-500 mb-4" size={48} /><h3 className="text-xl font-bold text-gray-800 mb-2">ยืนยันการปิดกะ?</h3><p className="text-gray-500 mb-6">คุณตรวจสอบความเรียบร้อยทั้งหมดแล้วใช่หรือไม่?</p><div className="flex gap-3"><button onClick={() => setShowCloseConfirm(false)} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">ยกเลิก</button><button onClick={handleCloseShift} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold hover:bg-rose-700 shadow-lg shadow-rose-200">ยืนยันปิดกะ</button></div></div></div>)}
            {showOpenCount && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl animate-in zoom-in duration-200 flex flex-col max-h-[90vh]"><div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800 flex items-center gap-2"><Coins className="text-yellow-500" /> นับเงินเปิดกะ</h3><button onClick={() => setShowOpenCount(false)}><X className="text-gray-400 hover:text-gray-600" /></button></div><div className="flex-1 overflow-y-auto custom-scrollbar pr-2 mb-4"><div className="space-y-3">{denominations.map(d => (<div key={d} className="flex items-center gap-4"><span className="w-20 font-bold text-right text-gray-700">{d >= 20 ? '฿'+d : d+' เหรียญ'}</span><input type="number" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-right font-mono" value={counts[d] || ''} onChange={(e) => setCounts({...counts, [d]: parseInt(e.target.value) || 0})} placeholder="0" /><span className="w-24 text-right text-gray-400 text-sm">= {(counts[d] * d).toLocaleString()}</span></div>))}</div></div><div className="bg-gray-50 p-4 rounded-xl mb-4 flex justify-between items-center"><span className="text-gray-500 font-bold">ยอดรวมทั้งหมด</span><span className="text-2xl font-bold text-emerald-600">฿{totalCount.toLocaleString()}</span></div><button onClick={handleOpenShift} className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200">ยืนยันยอดเงินเริ่มกะ</button></div></div>)}
            {showPinModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-8 max-w-xs w-full shadow-2xl text-center"><Lock className="mx-auto text-gray-400 mb-4" size={32} /><h3 className="text-lg font-bold text-gray-800 mb-4">ใส่รหัสเพื่อเปิดลิ้นชัก</h3><input type="password" className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-center text-2xl tracking-widest mb-6 focus:border-gray-800 outline-none transition" autoFocus placeholder="••••" value={pin} onChange={(e) => setPin(e.target.value)} /><div className="flex gap-3"><button onClick={() => {setShowPinModal(false); setPin('')}} className="flex-1 py-3 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">ยกเลิก</button><button onClick={handleOpenDrawer} className="flex-1 py-3 rounded-xl bg-gray-800 text-white font-bold hover:bg-black">ตกลง</button></div></div></div>)}
            {showHistory && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"><div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl h-[600px] flex flex-col"><div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-gray-800">ประวัติการเปิด/ปิดกะ</h3><button onClick={() => setShowHistory(false)}><X className="text-gray-400 hover:text-gray-600" /></button></div><div className="flex-1 flex items-center justify-center text-gray-400"><p>ส่วนแสดงรายการประวัติ (Mockup)</p></div></div></div>)}
        </div>
    );
};

// --- PAYMENT MODAL ---
const PaymentModal = ({ isOpen, onClose, cartItems, total, member, onConfirm, settings }) => {
  const [pointsRedeem, setPointsRedeem] = useState(false);
  const earnedPoints = Math.floor(total / 50);
  const serviceItemsTotal = cartItems.filter(item => item.type === 'service').reduce((sum, item) => sum + ((item.price * item.qty) - (item.discount || 0)), 0);
  const maxRedeemablePoints = Math.min(member.points, serviceItemsTotal);
  const discountAmount = pointsRedeem ? maxRedeemablePoints : 0;
  const finalTotal = Math.max(0, total - discountAmount);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col">
        <div className="bg-gray-900 p-6 text-white flex justify-between items-center"><div><h3 className={`${FONTS.header} text-2xl font-bold`}>ชำระเงิน</h3><p className={`${FONTS.body} text-gray-400 text-sm`}>กรุณาตรวจสอบยอดชำระ</p></div><button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition"><X size={20} /></button></div>
        <div className="p-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-2"><span className="text-gray-500 text-sm font-medium mb-1">ยอดชำระสุทธิ</span><span className={`${FONTS.header} text-5xl font-bold text-emerald-600`}>{settings.currencySymbol}{finalTotal.toLocaleString()}</span>{pointsRedeem && <span className="text-xs text-emerald-500 font-bold mt-2 bg-emerald-50 px-2 py-1 rounded-lg">ลดราคาจากแต้ม: -{discountAmount.toLocaleString()}</span>}</div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-3"><div className="flex justify-between items-center"><div className="flex items-center gap-2"><Star className="text-amber-400 fill-amber-400" size={18} /><span className="text-sm font-bold text-gray-700">คะแนนที่จะได้รับ</span></div><span className="text-lg font-bold text-amber-500">+{earnedPoints.toLocaleString()}</span></div><p className="text-xs text-gray-400 text-right">(คำนวณจากยอด 50 บาท = 1 คะแนน)</p></div>
          <div className={`rounded-xl p-4 border transition-all ${pointsRedeem ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
            <div className="flex justify-between items-center mb-2"><div className="flex items-center gap-2"><Coins className={pointsRedeem ? "text-amber-600" : "text-gray-400"} size={20} /><div><h4 className={`text-sm font-bold ${pointsRedeem ? 'text-amber-800' : 'text-gray-700'}`}>ใช้คะแนนแลกส่วนลด</h4><p className="text-xs text-gray-500">มีคะแนนสะสม: {member.points.toLocaleString()}</p></div></div><div onClick={() => { if (serviceItemsTotal <= 0 && !pointsRedeem) { alert("ไม่มีรายการ 'บริการ' ในบิลนี้ ไม่สามารถใช้คะแนนได้"); return; } if (member.points <= 0 && !pointsRedeem) { alert("คะแนนสะสมไม่เพียงพอ"); return; } setPointsRedeem(!pointsRedeem); }} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${pointsRedeem ? 'bg-amber-500' : 'bg-gray-200'}`}><div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${pointsRedeem ? 'translate-x-6' : 'translate-x-0'}`}></div></div></div>
            {pointsRedeem && (<div className="text-xs text-amber-700 border-t border-amber-200/50 pt-2 mt-2"><p>สามารถใช้ลดได้สูงสุด: <span className="font-bold">{maxRedeemablePoints.toLocaleString()} บาท</span></p><p className="opacity-75">(เฉพาะรายการค่าบริการ)</p></div>)}
            {!pointsRedeem && serviceItemsTotal > 0 && member.points > 0 && (<p className="text-xs text-gray-400 mt-1 pl-7">ใช้คะแนนลดได้สูงสุด {Math.min(member.points, serviceItemsTotal).toLocaleString()} บาท (เฉพาะบริการ)</p>)}
          </div>
        </div>
        <div className="p-6 pt-0"><button onClick={() => onConfirm(finalTotal, earnedPoints)} className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg shadow-lg shadow-emerald-200 transition active:scale-95 flex items-center justify-center gap-2"><CheckCircle2 /> ยืนยันการชำระเงิน</button></div>
      </div>
    </div>
  );
};

// --- MAIN POS MODULE ---
const POSModule = ({ cartItems, setCartItems, currentMember, recommendedItems, handleNavigate, setIsDrawerOpen, setIsMemberSearchOpen, setIsNewMemberOpen, addToCart, calculateTotal, settings }) => {
  const [activePOSPage, setActivePOSPage] = useState('terminal'); 
  const [heldBills, setHeldBills] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showRecallModal, setShowRecallModal] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Cash');

  const subtotal = calculateTotal();
  const taxAmount = subtotal * settings.taxRate;
  const discount = 220; // Fixed discount for demo
  const grandTotal = Math.max(0, subtotal + taxAmount - discount); 

  const currentMemberPets = useMemo(() => {
    if (!currentMember || !currentMember.petIds) return [];
    return currentMember.petIds.map(id => PetsDB.find(p => p.id === id)).filter(Boolean);
  }, [currentMember]);

  const getPetEmoji = (type) => {
    switch(type) { case 'dog': return '🐕'; case 'cat': return '🐈'; case 'rabbit': return '🐇'; case 'bird': return '🦜'; case 'fish': return '🐟'; default: return '🐾'; }
  };

  const handleHoldBill = () => {
    if (cartItems.length === 0) return;
    const newHeldBill = { id: Date.now(), items: [...cartItems], member: currentMember, timestamp: new Date(), total: grandTotal };
    setHeldBills(prev => [newHeldBill, ...prev]);
    setCartItems([]);
  };

  const handleRecallBill = (bill) => {
    setCartItems(bill.items);
    setHeldBills(prev => prev.filter(b => b.id !== bill.id));
    setShowRecallModal(false);
  };

  const handlePaymentComplete = (paidAmount, pointsEarned) => {
    console.log(`Payment Complete: ${paidAmount}, Points: ${pointsEarned}`);
    setShowPaymentModal(false);
    setCartItems([]);
    alert(`ชำระเงินเรียบร้อย! \nยอดชำระ: ${paidAmount.toLocaleString()} บาท\nได้รับคะแนน: ${pointsEarned} คะแนน`);
  };

  return (
  <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
    <POSSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={handleNavigate} activeTab={activePOSPage} onTabChange={setActivePOSPage} />
    <div className="flex-1 flex flex-col min-w-0">
      {activePOSPage === 'terminal' ? (
        <>
            <header className="h-20 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4"><div className="flex flex-col"><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}><span onClick={() => setIsMemberSearchOpen(true)} className="hover:text-emerald-600 hover:underline cursor-pointer transition">{currentMember.name}</span><span onClick={() => setIsMemberSearchOpen(true)} className="text-emerald-500 cursor-pointer bg-emerald-50 p-1 rounded-full hover:bg-emerald-100 transition"><Search size={18} /></span><span onClick={() => setIsNewMemberOpen(true)} className="text-emerald-500 cursor-pointer bg-emerald-50 p-1 rounded-full hover:bg-emerald-100 transition"><Plus size={18} /></span></h2><p className={`${FONTS.body} text-gray-400 text-sm flex items-center gap-1`}><Smartphone size={14} /> {currentMember.phone}</p></div></div>
                <div className="flex items-center gap-8">
                  <div className="flex items-center text-gray-400 gap-2"><Users size={18} /> <span className="font-bold">{currentMember.pets?.length || 0}</span><span className="mx-1">|</span><Scissors size={18} /> <span className="font-bold">{currentMember.visits}</span></div>
                  <div className={`border rounded-xl px-4 py-2 flex items-center gap-3 transition-colors ${currentMember.levelColor || 'bg-gray-100 text-gray-500'} border-transparent`}>
                      <div className="text-right"><p className={`${FONTS.header} text-xs font-bold opacity-80`}>ระดับสมาชิก</p><p className={`${FONTS.header} text-sm font-bold`}>★ {currentMember.level}</p></div>
                      <div className="h-8 w-px bg-current opacity-20"></div>
                      <div className="text-right"><p className={`${FONTS.header} text-xs font-bold opacity-80`}>คะแนนสะสม</p><p className={`${FONTS.header} text-lg font-bold`}>{currentMember.points.toLocaleString()}</p></div>
                  </div>
                </div>
            </header>
            <div className="flex-1 p-3 flex gap-3 overflow-hidden">
                <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 pb-2"><div className="relative"><Scan className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={24} /><input type="text" placeholder="สแกนบาร์โค้ด หรือ ค้นหาสินค้า..." className={`${FONTS.header} w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-emerald-400 focus:bg-white transition-all outline-none text-lg text-gray-700 placeholder-gray-400`} /></div></div>
                    <div className="px-4 py-2 grid grid-cols-12 gap-4 text-gray-400 text-xs font-bold border-b border-gray-100"><div className="col-span-4 text-left pl-2">ชื่อสินค้า</div><div className="col-span-2 text-center">ราคา</div><div className="col-span-2 text-center">ส่วนลด</div><div className="col-span-2 text-center">จำนวน</div><div className="col-span-1 text-center">รวม</div><div className="col-span-1 text-center">หน่วย</div></div>
                    <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">{cartItems.map((item) => (<div key={item.id} className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-50 hover:bg-gray-50 rounded-xl transition px-2 group"><div className="col-span-4 flex items-center gap-3"><div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold shrink-0 ${item.type === 'service' ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 text-gray-400'}`}>{item.code}</div><div><p className={`${FONTS.header} text-gray-800 font-medium text-sm line-clamp-2`}>{item.name}</p>{item.type === 'service' && <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded">บริการ</span>}</div></div><div className="col-span-2 text-center"><p className={`${FONTS.body} text-gray-800 font-bold`}>{item.price.toFixed(2)}</p></div><div className="col-span-2 flex flex-col items-center justify-center gap-1">{item.discount > 0 ? (<span className="text-red-500 text-xs font-bold">-{item.discount}</span>) : (<span className="text-gray-300 text-xs">-</span>)}{item.promo && (<span className="bg-blue-100 text-blue-600 text-[10px] px-2 py-0.5 rounded-full font-bold">{item.promo}</span>)}</div><div className="col-span-2 flex justify-center"><div className="flex items-center bg-white border border-gray-200 rounded-lg h-8"><button className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-l-lg transition" onClick={() => { setCartItems(prev => prev.map(i => i.id === item.id ? {...i, qty: i.qty - 1} : i).filter(i => i.qty > 0)); }}><Minus size={14} /></button><input type="text" value={item.qty} readOnly className="w-8 text-center text-sm font-bold text-gray-700 outline-none" /><button className="w-8 h-full flex items-center justify-center text-gray-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-r-lg transition" onClick={() => { const newItems = cartItems.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i); setCartItems(newItems); }}><Plus size={14} /></button></div></div><div className="col-span-1 text-center"><span className={`${FONTS.header} text-emerald-600 font-bold`}>{settings.currencySymbol}{((item.price * item.qty) - item.discount).toLocaleString()}</span></div><div className="col-span-1 text-center"><span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded-md">{item.unit}</span></div></div>))} {cartItems.length === 0 && (<div className="flex flex-col items-center justify-center h-40 text-gray-400"><Store size={48} className="mb-2 opacity-20" /><p className={`${FONTS.body}`}>ไม่มีสินค้าในตะกร้า</p></div>)}</div>
                    <div className="bg-gray-50 p-6 rounded-b-3xl border-t border-gray-100"><div className="flex justify-between items-end mb-4"><div className="space-y-1 text-right w-1/2"><div className="flex justify-between text-gray-500 text-sm"><span>ส่วนลดท้ายบิล</span><span className="font-bold text-gray-800">-{settings.currencySymbol}220</span></div><div className="flex justify-between text-gray-500 text-sm"><span>ภาษีมูลค่าเพิ่ม ({(settings.taxRate * 100)}%)</span><span className="font-bold text-gray-800">{settings.currencySymbol}{taxAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div></div><div className="flex flex-col items-end"><span className={`${FONTS.header} text-gray-500 text-sm`}>ยอดรวมสุทธิ</span><span className={`${FONTS.header} text-4xl font-bold text-emerald-600`}>{settings.currencySymbol}{grandTotal.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div></div>
                    <div className="grid grid-cols-12 gap-3 h-16">
                      <button onClick={handleHoldBill} className="col-span-2 bg-white border border-orange-500 text-orange-600 rounded-xl font-bold hover:bg-orange-50 transition flex items-center justify-center gap-1"><Power size={18} /> พักบิล</button>
                      <button onClick={() => setShowRecallModal(true)} className="col-span-2 bg-white border border-blue-500 text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition flex items-center justify-center gap-1 relative"><RefreshCcw size={18} /> เรียกบิล{heldBills.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">{heldBills.length}</span>}</button>
                      <div className="col-span-4 grid grid-cols-4 gap-2">{[{ id: 'Cash', icon: Wallet, label: 'เงินสด' }, { id: 'Transfer', icon: CreditCard, label: 'โอนเงิน' }, { id: 'Scan', icon: QrCode, label: 'สแกน' }, { id: 'Wallet', icon: Smartphone, label: 'Wallet' }].map((m) => (<button key={m.id} onClick={() => setSelectedPaymentMethod(m.id)} className={`border rounded-xl flex flex-col items-center justify-center transition ${selectedPaymentMethod === m.id ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-500 hover:text-emerald-500'}`}><m.icon size={18} /><span className="text-[10px] mt-1">{m.label}</span></button>))}</div>
                      <button onClick={() => { if (cartItems.length === 0) return; setShowPaymentModal(true); }} disabled={cartItems.length === 0} className={`col-span-4 rounded-2xl text-xl font-bold shadow-lg transition-all active:scale-95 ${cartItems.length > 0 ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>ชำระเงิน</button>
                    </div>
                  </div>
                </div>
                <div className="w-72 flex flex-col gap-2 shrink-0">
                    <div className="flex flex-wrap items-start justify-start gap-2 py-1 min-h-[50px] content-start">
                      {currentMemberPets.length > 0 ? (currentMemberPets.map((pet, i) => (<div key={i} className="flex flex-col items-center gap-1 cursor-pointer group w-[3.5rem]"><div className="relative w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-lg group-hover:scale-110 transition">{getPetEmoji(pet.type)}{pet.chronicDiseases && pet.chronicDiseases.length > 0 && (<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center border border-white">!</div>)}</div><span className={`${FONTS.header} text-[10px] font-bold text-gray-600 truncate w-full text-center`}>{pet.name}</span></div>))) : (<div className="flex flex-col items-center justify-center w-full py-1 text-gray-400 opacity-50"><PawPrint size={20} className="mb-0.5"/><span className="text-[10px]">ไม่พบสัตว์เลี้ยง</span></div>)}
                      <div className="flex flex-col items-center gap-1 cursor-pointer group w-[3.5rem]"><div className="w-10 h-10 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition bg-white"><Plus size={18} /></div><span className={`${FONTS.header} text-[10px] font-bold text-gray-400`}>เพิ่ม</span></div>
                    </div>
                    <div className="bg-white p-1 rounded-xl flex shadow-sm border border-gray-100">{['ประวัติ', 'แนะนำ', 'โปรฯ'].map((tab, i) => (<button key={i} className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${i === 1 ? 'bg-emerald-50 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}>{i === 1 && <Star size={14} className="inline mr-1 mb-0.5" />}{tab}</button>))}</div>
                    <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 p-4 flex flex-col overflow-hidden"><div className="overflow-y-auto space-y-3 pr-1 custom-scrollbar">{recommendedItems.map((item) => (<div key={item.id} className="bg-white border border-gray-100 rounded-xl p-3 flex items-center gap-3 hover:shadow-md transition group cursor-pointer"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.type === 'service' ? 'bg-purple-50 text-purple-500' : 'bg-blue-50 text-blue-500'}`}>{item.type === 'service' ? <Scissors size={20} /> : <Package size={20} />}</div><div className="flex-1 min-w-0"><h4 className={`${FONTS.header} text-sm font-bold text-gray-700 truncate`}>{item.name}</h4><p className="text-emerald-600 text-xs font-bold">฿{item.price.toLocaleString()}</p></div><button onClick={() => addToCart(item)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-emerald-600 hover:bg-emerald-500 hover:text-white transition"><Plus size={16} /></button></div>))}</div></div>
                </div>
            </div>
            <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} cartItems={cartItems} total={grandTotal} member={currentMember} settings={settings} onConfirm={handlePaymentComplete}/>
            {showRecallModal && (<div className="fixed inset-0 z-[99] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowRecallModal(false)}></div><div className="relative bg-white w-full max-w-lg rounded-3xl shadow-xl p-6"><div className="flex justify-between items-center mb-4"><h3 className={`${FONTS.header} text-xl font-bold`}>รายการบิลที่พักไว้</h3><button onClick={() => setShowRecallModal(false)}><X size={24} className="text-gray-400" /></button></div><div className="space-y-2 max-h-[60vh] overflow-y-auto">{heldBills.length === 0 ? (<p className="text-center text-gray-400 py-8">ไม่มีบิลที่พักไว้</p>) : (heldBills.map(bill => (<div key={bill.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200"><div><p className="font-bold text-gray-800">บิลเวลา {bill.timestamp.toLocaleTimeString()}</p><p className="text-sm text-gray-500">{bill.items.length} รายการ | ลูกค้า: {bill.member.name}</p></div><button onClick={() => handleRecallBill(bill)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">เรียกคืน</button></div>)))}</div></div></div>)}
        </>
      ) : activePOSPage === 'cashDrawer' ? (
        <CashDrawerView settings={settings} />
      ) : (
        <BillHistoryView />
      )}
    </div>
  </div>
  );
};

// ==========================================
// ZONE E (Part 3): PURCHASING DOCUMENT FLOW
// ==========================================

// --- 1. PURCHASE ORDERS (PO) ---

const PurchaseOrderListView = ({ onSelectPO, orders = [], onSendPO, onUpdateStatus }) => { 
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPOs = orders.filter(po => {
        const id = po.id ? po.id.toLowerCase() : '';
        const supplier = po.supplier ? po.supplier.toLowerCase() : '';
        const term = searchTerm.toLowerCase();

        const matchesSearch = id.includes(term) || supplier.includes(term);
        const matchesStatus = filterStatus === 'All' || po.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'Received': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
            case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] relative">
             <div className="px-8 py-6 border-b border-gray-200 bg-white shadow-sm z-10">
                <div className="flex justify-between items-center mb-4">
                    <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>รายการใบสั่งซื้อ (Purchase Orders)</h1>
                    <div className="flex gap-2">
                        {['All', 'Pending', 'Received', 'Completed', 'Cancelled'].map(status => (
                            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm transition-all ${filterStatus === status ? 'bg-gray-900 text-white font-bold shadow-md' : 'text-gray-500 font-medium hover:text-gray-900'}`}>{status === 'All' ? 'ทั้งหมด' : status}</button>
                        ))}
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" placeholder="ค้นหาเลขที่เอกสาร หรือ ชื่อผู้จัดจำหน่าย..." className={`${FONTS.header} w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition`} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            
            <div className="flex-1 p-8 pt-0 overflow-hidden">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden mt-6">
                    <div className="overflow-y-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="p-4 pl-6 font-bold text-center w-32">Actions</th> 
                                    <th className="p-4 font-bold text-center">สถานะ</th>
                                    <th className="p-4 font-bold">เลขที่ใบสั่งซื้อ</th>
                                    <th className="p-4 font-bold">วันที่</th>
                                    <th className="p-4 font-bold">ผู้จัดจำหน่าย</th>
                                    <th className="p-4 font-bold text-center">รายการ</th>
                                    <th className="p-4 font-bold text-right">ยอดรวม</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-sm">
                                {filteredPOs.length > 0 ? (
                                    filteredPOs.map((po) => (
                                        <tr key={po.id} onClick={() => onSelectPO(po)} className="hover:bg-blue-50/50 transition cursor-pointer group">
                                            <td className="p-4 pl-6 text-center" onClick={(e) => e.stopPropagation()}>
                                                {!po.isSent && po.status === 'Pending' ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button onClick={() => onSendPO(po.id, 'Email')} className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm" title="ส่ง Email"><Mail size={16} /></button>
                                                        <button onClick={() => onSendPO(po.id, 'Line')} className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition shadow-sm" title="ส่ง Line"><MessageCircle size={16} /></button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center justify-center text-emerald-500 gap-1 opacity-70"><CheckCircle size={16} /> <span className="text-xs font-bold">Sent</span></div>
                                                )}
                                            </td>
                                            <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                                <div className="relative inline-block">
                                                    <select value={po.status} onChange={(e) => onUpdateStatus(po.id, e.target.value)} className={`appearance-none px-3 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer text-center min-w-[100px] ${getStatusColor(po.status)}`}>
                                                        <option value="Pending">Pending</option>
                                                        <option value="Received">Received</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Cancelled">Cancelled</option>
                                                    </select>
                                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none opacity-50"><ChevronDown size={12} /></div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono font-bold text-blue-600 group-hover:underline">{po.id}</td>
                                            <td className="p-4 text-gray-600">{po.date}</td>
                                            <td className="p-4 font-bold text-gray-800">{po.supplier}</td>
                                            <td className="p-4 text-center text-gray-600">{Array.isArray(po.items) ? po.items.length : 0}</td>
                                            <td className="p-4 text-right font-bold text-gray-800">฿{po.total.toLocaleString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="7" className="p-12 text-center text-gray-400">ไม่พบใบสั่งซื้อ</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PurchaseOrderDetailView = ({ items, poData, onClose }) => {
    const totalAmount = items.reduce((sum, item) => sum + ((item.cost || 0) * item.qty), 0);
    const poNumber = poData?.id || `PO-NEW`;
    const today = poData?.date || new Date().toLocaleDateString('th-TH');
    const supplier = poData?.supplier || items[0]?.supplier || 'Multiple Suppliers';
    const status = poData?.status || 'New';

    const [sendingStatus, setSendingStatus] = useState(null);

    const handleSend = (type) => {
        if (type === 'print') { window.print(); return; }
        setSendingStatus(type);
        setTimeout(() => { setSendingStatus(null); onClose(); }, 2000);
    };

    const getSubUnitInfo = (item) => {
        const multiplier = item.packDetail ? parseInt(item.packDetail.match(/\d+/)?.[0] || 1) : 1;
        const subUnit = item.packDetail ? item.packDetail.split('/')[0].replace(/\d+/, '').trim() : item.unit;
        const totalSubUnits = item.qty * multiplier;
        return { totalSubUnits, subUnit, display: item.packDetail ? `${item.qty} ${item.unit} (${totalSubUnits} ${subUnit})` : `${item.qty} ${item.unit}` };
    };

    return (
        <div className="flex flex-col h-full bg-white relative animate-in fade-in duration-300">
             {sendingStatus && (
                <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl border border-gray-100">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg ${sendingStatus === 'line' ? 'bg-[#06C755] text-white shadow-green-200' : 'bg-blue-500 text-white shadow-blue-200'}`}>{sendingStatus === 'line' ? <MessageCircle size={40} fill="white" /> : <Mail size={40} />}</div>
                        <h3 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ส่งใบสั่งซื้อเรียบร้อยแล้ว</h3>
                        <p className={`${FONTS.body} text-gray-500 mt-2 text-lg`}>{sendingStatus === 'line' ? 'ส่งไปยัง Line ผู้ขายแล้ว' : 'ส่งไปยัง Email ผู้ขายแล้ว'}</p>
                    </div>
                </div>
            )}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm">
                 <div className="flex items-center gap-4"><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={24}/></button><div><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}><FileText className="text-emerald-600" /> ใบสั่งซื้อ (Purchase Order)</h2><p className={`${FONTS.body} text-sm text-gray-400`}>เลขที่เอกสาร: {poNumber} • วันที่: {today}</p></div></div>
                 <div className="flex gap-3"><button onClick={() => handleSend('print')} className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"><Printer size={18}/> พิมพ์</button><button onClick={() => handleSend('email')} className="flex items-center gap-2 px-6 py-2.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl font-bold hover:bg-blue-100 transition shadow-sm"><Mail size={18}/> อีเมลผู้ขาย</button><button onClick={() => handleSend('line')} className="flex items-center gap-2 px-6 py-2.5 bg-[#06C755] text-white rounded-xl font-bold hover:bg-[#05b64d] shadow-lg shadow-green-200 transition"><MessageCircle size={18} fill="white"/> ส่ง Line</button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50">
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-gray-100 min-h-[800px]">
                    <div className="flex justify-between items-start mb-12 border-b-2 border-gray-100 pb-8"><div><h1 className={`${FONTS.header} text-4xl font-bold text-gray-800 mb-2 tracking-tight`}>{SYSTEM_DEFAULTS.shopName}</h1><p className={`${FONTS.body} text-gray-500 text-sm leading-relaxed`}>123 ถนนสุขุมวิท...<br/>โทร: 02-123-4567 | Email: purchase@petomni.com</p></div><div className="text-right"><div className={`inline-block px-4 py-1 rounded-lg text-sm font-bold border mb-2 ${status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>{status === 'New' ? 'ต้นฉบับ (Original)' : status}</div><h2 className={`${FONTS.header} text-xl font-bold text-gray-400 uppercase tracking-widest`}>Purchase Order</h2><p className={`${FONTS.body} text-gray-800 font-mono text-xl mt-1 font-bold`}>{poNumber}</p></div></div>
                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100"><p className={`${FONTS.header} text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider`}>ผู้จำหน่าย (Vendor)</p><p className={`${FONTS.header} text-xl font-bold text-gray-800 mb-1`}>{supplier}</p><p className={`${FONTS.body} text-gray-500 text-sm`}>สำนักงานใหญ่...</p></div>
                        <div className="p-6 bg-gray-50 rounded-xl border border-gray-100"><p className={`${FONTS.header} text-xs font-bold text-gray-400 uppercase mb-3 tracking-wider`}>จัดส่งที่ (Ship To)</p><p className={`${FONTS.header} text-xl font-bold text-gray-800 mb-1`}>{SYSTEM_DEFAULTS.shopName}</p><p className={`${FONTS.body} text-gray-500 text-sm`}>คลังสินค้าหลัก...</p></div>
                    </div>
                    <table className="w-full mb-12">
                        <thead className="bg-gray-50 border-y border-gray-200"><tr><th className={`${FONTS.header} py-4 pl-4 text-left text-xs font-bold text-gray-500 w-16`}>ลำดับ</th><th className={`${FONTS.header} py-4 text-left text-xs font-bold text-gray-500`}>รายการสินค้า</th><th className={`${FONTS.header} py-4 text-right text-xs font-bold text-gray-500 w-32 uppercase tracking-wider`}>จำนวน (หน่วยย่อย)</th><th className={`${FONTS.header} py-4 text-right text-xs font-bold text-gray-500 w-32 uppercase tracking-wider`}>ราคา/หน่วย</th><th className={`${FONTS.header} py-4 pr-4 text-right text-xs font-bold text-gray-500 w-32 uppercase tracking-wider`}>รวมเงิน</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">{items.map((item, index) => {
                             const subUnitInfo = getSubUnitInfo(item);
                             return (<tr key={item.id}><td className="py-5 pl-4 text-center text-gray-400 text-sm">{index + 1}</td><td className="py-5"><p className={`${FONTS.header} text-gray-800 font-bold text-base`}>{item.name}</p><p className={`${FONTS.body} text-gray-500 text-xs mt-0.5`}>{item.barcode} | {item.brand}</p></td><td className="py-5 text-right text-gray-800"><span className="font-bold text-sm block">{subUnitInfo.display}</span>{item.packDetail && <span className="text-xs text-gray-400 font-normal">({item.packDetail})</span>}</td><td className="py-5 text-right text-gray-800 text-sm">{item.cost.toLocaleString()}<span className="text-gray-400 text-xs block">/{item.unit}</span></td><td className="py-5 pr-4 text-right text-gray-800 font-bold text-sm">{(item.cost * item.qty).toLocaleString()}</td></tr>);
                        })}</tbody>
                    </table>
                    <div className="flex justify-end border-t border-gray-200 pt-8"><div className="w-80 space-y-4"><div className="flex justify-between text-sm text-gray-600"><span>รวมเป็นเงิน</span><span className="font-medium">{totalAmount.toLocaleString()}</span></div><div className="flex justify-between text-sm text-gray-600"><span>VAT 7%</span><span className="font-medium">{(totalAmount * 0.07).toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div><div className="flex justify-between text-xl font-bold text-gray-900 border-t-2 border-gray-100 pt-4 mt-2"><span>ยอดรวมสุทธิ</span><span className="text-emerald-600">{SYSTEM_DEFAULTS.currencySymbol}{(totalAmount * 1.07).toLocaleString(undefined, {maximumFractionDigits: 2})}</span></div></div></div>
                    <div className="grid grid-cols-2 gap-20 mt-24"><div className="text-center"><div className="border-b border-gray-300 pb-12 mb-3"></div><p className={`${FONTS.header} text-sm font-bold text-gray-600`}>ผู้จัดทำ</p></div><div className="text-center"><div className="border-b border-gray-300 pb-12 mb-3"></div><p className={`${FONTS.header} text-sm font-bold text-gray-600`}>ผู้อนุมัติ</p></div></div>
                </div>
            </div>
        </div>
    );
};

// --- 2. GOODS RECEIPTS (GR) ---

const GoodsReceiptListView = ({ onSelectGR, receipts = [] }) => {
    const [filterStatus, setFilterStatus] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    // Use props if available, else mock
    const displayReceipts = receipts.length > 0 ? receipts : MOCK_GOODS_RECEIPTS; 

    const filteredGRs = displayReceipts.filter(gr => {
        const matchesSearch = gr.id.toLowerCase().includes(searchTerm.toLowerCase()) || gr.supplier.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || gr.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch(status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Pending Inspection': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Discrepancy': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]">
             <div className="px-8 py-6 border-b border-gray-200 bg-white">
                <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800 mb-4`}>รายการใบรับสินค้า (Goods Receipts)</h1>
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl border border-gray-200">
                        {['All', 'Pending Inspection', 'Completed', 'Discrepancy'].map(status => (
                            <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-2 rounded-lg text-sm transition-all ${filterStatus === status ? 'bg-gray-900 text-white font-bold shadow-md' : 'text-gray-500 font-medium hover:text-gray-900'}`}>{status === 'All' ? 'ทั้งหมด' : status}</button>
                        ))}
                    </div>
                    <div className="relative w-64">
                         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                         <input type="text" placeholder="ค้นหาเลขที่, PO, ผู้ขาย..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 outline-none" />
                    </div>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="grid grid-cols-1 gap-4">
                    {filteredGRs.map(gr => (
                        <div key={gr.id} onClick={() => onSelectGR(gr)} className="bg-white p-5 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group">
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 rounded-lg bg-gray-50 text-emerald-600 group-hover:bg-emerald-50 transition-colors"><Truck size={20} /></div>
                                    <div><h3 className={`${FONTS.header} text-lg font-bold text-gray-800`}>{gr.id}</h3><p className={`${FONTS.body} text-sm text-gray-400 flex items-center gap-1`}>Ref PO: <span className="text-gray-600 font-mono">{gr.poId}</span> • <ClockIcon size={12}/> {gr.date}</p></div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(gr.status)}`}>{gr.status}</div>
                            </div>
                            <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                                <div><p className="text-xs text-gray-400 mb-1">ผู้จัดจำหน่าย</p><p className="text-sm font-medium text-gray-700">{gr.supplier}</p></div>
                                <div className="text-right"><p className="text-xs text-gray-400 mb-1">จำนวนรายการ</p><p className={`${FONTS.header} text-xl font-bold text-emerald-600`}>{gr.totalItems} หน่วย</p></div>
                            </div>
                        </div>
                    ))}
                    {filteredGRs.length === 0 && (<div className="text-center py-20 text-gray-400"><Truck size={48} className="mx-auto mb-4 opacity-20"/><p>ไม่พบเอกสารใบรับสินค้า</p></div>)}
                </div>
             </div>
        </div>
    );
};

const GoodsReceiptDetailView = ({ grData, onClose }) => {
    const [mode, setMode] = useState(grData.status === 'Pending Inspection' ? 'inspect' : 'final'); 
    const [inspectionItems, setInspectionItems] = useState(grData.items.map(item => ({ ...item, actualQty: item.qty })));
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [sendingStatus, setSendingStatus] = useState(null);

    const getSubUnitInfo = (item, qty) => {
        const multiplier = item.packDetail ? parseInt(item.packDetail.match(/\d+/)?.[0] || 1) : 1;
        const subUnit = item.packDetail ? item.packDetail.split('/')[0].replace(/\d+/, '').trim() : item.unit;
        const totalSubUnits = qty * multiplier;
        return { totalSubUnits, subUnit, display: item.packDetail ? `${qty} ${item.unit} (${totalSubUnits} ${subUnit})` : `${qty} ${item.unit}` };
    };

    const handleActualQtyChange = (itemId, val) => {
        const newQty = parseInt(val) || 0;
        setInspectionItems(prev => prev.map(item => item.id === itemId ? { ...item, actualQty: newQty } : item));
    };

    const handleSaveInspection = () => {
        const hasDiscrepancy = inspectionItems.some(item => item.qty !== item.actualQty);
        if (hasDiscrepancy) {
            setShowOtpModal(true);
            setOtp('');
            setOtpError('');
        } else {
            setMode('final');
        }
    };

    const handleConfirmOtp = () => {
        if (otp === '1234') { setShowOtpModal(false); setMode('final'); } else { setOtpError('รหัส OTP ไม่ถูกต้อง'); }
    };

    const handleSend = (type) => {
        if (type === 'print') { window.print(); return; }
        setSendingStatus(type);
        setTimeout(() => { setSendingStatus(null); onClose(); }, 2000);
    };

    if (mode === 'inspect') {
        return (
            <div className="flex flex-col h-full bg-[#F9FAFB] relative">
                 <div className="px-8 py-5 border-b border-gray-200 bg-white flex justify-between items-center sticky top-0 z-20">
                     <div className="flex items-center gap-4"><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={24}/></button><div><h2 className={`${FONTS.header} text-xl font-bold text-gray-800 flex items-center gap-2`}><ClipboardCheck className="text-emerald-600" /> ตรวจรับสินค้า (Inspection)</h2><p className={`${FONTS.body} text-sm text-gray-400`}>{grData.id} • {grData.supplier}</p></div></div>
                     <button onClick={handleSaveInspection} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition">บันทึกการตรวจรับ</button>
                 </div>
                 <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                         <table className="w-full">
                             <thead className="bg-gray-50 border-b border-gray-200"><tr><th className={`${FONTS.header} py-4 pl-6 text-left text-xs font-bold text-gray-500`}>สินค้า</th><th className={`${FONTS.header} py-4 text-center text-xs font-bold text-gray-500`}>จำนวนสั่งซื้อ (Expected)</th><th className={`${FONTS.header} py-4 text-center text-xs font-bold text-gray-500`}>จำนวนรับจริง (Actual)</th><th className={`${FONTS.header} py-4 text-center text-xs font-bold text-gray-500`}>สถานะ</th></tr></thead>
                             <tbody className="divide-y divide-gray-100">{inspectionItems.map((item) => {
                                     const expectedInfo = getSubUnitInfo(item, item.qty);
                                     const actualInfo = getSubUnitInfo(item, item.actualQty);
                                     const isMatch = item.qty === item.actualQty;
                                     return (<tr key={item.id} className={!isMatch ? 'bg-red-50/30' : ''}><td className="py-4 pl-6"><p className={`${FONTS.header} text-gray-800 font-bold text-sm`}>{item.name}</p><p className={`${FONTS.body} text-gray-500 text-xs`}>{item.barcode}</p></td><td className="py-4 text-center"><span className="text-gray-800 font-medium">{expectedInfo.display}</span></td><td className="py-4 text-center"><div className="flex justify-center items-center gap-2"><button onClick={() => handleActualQtyChange(item.id, Math.max(0, item.actualQty - 1))} className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"><Minus size={14}/></button><input type="number" value={item.actualQty} onChange={(e) => handleActualQtyChange(item.id, e.target.value)} className={`w-16 text-center border rounded-lg py-1 font-bold ${!isMatch ? 'border-red-300 text-red-600 bg-white' : 'border-gray-200 text-gray-800'}`} /><button onClick={() => handleActualQtyChange(item.id, item.actualQty + 1)} className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-600"><Plus size={14}/></button></div><p className="text-xs text-gray-400 mt-1">({actualInfo.totalSubUnits} {actualInfo.subUnit})</p></td><td className="py-4 text-center">{isMatch ? (<span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-full"><CheckCircle size={12}/> ครบถ้วน</span>) : (<span className="inline-flex items-center gap-1 text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded-full"><AlertCircle size={12}/> ไม่ตรง</span>)}</td></tr>);
                                 })}</tbody>
                         </table>
                     </div>
                 </div>
                 {showOtpModal && (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowOtpModal(false)}></div><div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95"><div className="bg-orange-500 p-6 flex justify-between items-start text-white"><div><h3 className={`${FONTS.header} text-xl font-bold flex items-center gap-2`}><ShieldCheck/> ยืนยันยอดไม่ตรง</h3><p className="text-orange-100 text-sm opacity-90">กรุณาขอรหัส OTP จากผู้ขาย</p></div><button onClick={() => setShowOtpModal(false)}><X/></button></div><div className="p-8"><div className="mb-6"><label className={`${FONTS.header} block text-sm font-bold text-slate-700 mb-2`}>รหัส OTP</label><input type="text" autoFocus className="w-full text-center text-3xl font-bold tracking-[0.5em] py-4 border-2 border-slate-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none text-slate-800" placeholder="0000" maxLength={4} value={otp} onChange={(e) => setOtp(e.target.value)} />{otpError && (<p className={`${FONTS.body} text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-1`}><AlertCircle size={14} /> {otpError}</p>)}</div><button onClick={handleConfirmOtp} className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg shadow-orange-200 transition">ยืนยัน OTP</button></div></div></div>)}
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white relative animate-in fade-in duration-300">
             {sendingStatus && (<div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"><div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100"><div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg ${sendingStatus === 'line' ? 'bg-[#06C755] text-white shadow-green-200' : 'bg-blue-500 text-white shadow-blue-200'}`}>{sendingStatus === 'line' ? <MessageCircle size={40} fill="white" /> : <Mail size={40} />}</div><h3 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ส่งใบรับสินค้าเรียบร้อยแล้ว</h3></div></div>)}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-20 shadow-sm">
                 <div className="flex items-center gap-4"><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={24}/></button><div><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}><Truck className="text-emerald-600" /> ใบรับสินค้า (Goods Receipt Note)</h2><p className={`${FONTS.body} text-sm text-gray-400`}>เลขที่: {grData.id} • วันที่: {grData.date}</p></div></div>
                 <div className="flex gap-3"><button onClick={() => handleSend('print')} className="flex items-center gap-2 px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 hover:text-gray-900 transition shadow-sm"><Printer size={18}/> พิมพ์</button><button onClick={() => handleSend('line')} className="flex items-center gap-2 px-6 py-2.5 bg-[#06C755] text-white rounded-xl font-bold hover:bg-[#05b64d] shadow-lg shadow-green-200 transition"><MessageCircle size={18} fill="white"/> ส่ง Line</button></div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-gray-50/50">
                <div className="max-w-4xl mx-auto bg-white p-12 rounded-xl shadow-sm border border-gray-100 min-h-[800px]">
                    <div className="flex justify-between items-start mb-12 border-b-2 border-gray-100 pb-8"><div><h1 className={`${FONTS.header} text-4xl font-bold text-gray-800 mb-2 tracking-tight`}>{SYSTEM_DEFAULTS.shopName}</h1><p className={`${FONTS.body} text-gray-500 text-sm leading-relaxed`}>123 ถนนสุขุมวิท...<br/>โทร: 02-123-4567</p></div><div className="text-right"><div className="inline-block bg-emerald-50 text-emerald-700 px-4 py-1 rounded-lg text-sm font-bold border border-emerald-100 mb-2">ต้นฉบับ</div><h2 className={`${FONTS.header} text-xl font-bold text-gray-400 uppercase tracking-widest`}>Goods Receipt</h2><p className={`${FONTS.body} text-gray-800 font-mono text-xl mt-1 font-bold`}>{grData.id}</p></div></div>
                    {inspectionItems.some(i => i.qty !== i.actualQty) && (<div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-start gap-3 text-orange-800"><AlertTriangle className="shrink-0 mt-0.5" /><div><h4 className="font-bold">หมายเหตุ: ยอดรับจริงไม่ตรงกับใบสั่งซื้อ</h4><p className="text-sm opacity-80">เอกสารนี้ได้รับการยืนยันด้วย OTP จากผู้ขายแล้ว</p></div></div>)}
                    <table className="w-full mb-12"><thead className="bg-gray-50 border-y border-gray-200"><tr><th className={`${FONTS.header} py-4 pl-4 text-left text-xs font-bold text-gray-500 w-16`}>ลำดับ</th><th className={`${FONTS.header} py-4 text-left text-xs font-bold text-gray-500`}>รายการสินค้า</th><th className={`${FONTS.header} py-4 text-right text-xs font-bold text-gray-500`}>จำนวนสั่ง</th><th className={`${FONTS.header} py-4 text-right text-xs font-bold text-gray-500`}>รับจริง (หน่วยย่อย)</th><th className={`${FONTS.header} py-4 pr-4 text-center text-xs font-bold text-gray-500`}>สถานะ</th></tr></thead><tbody className="divide-y divide-gray-100">{inspectionItems.map((item, index) => { const subUnitInfo = getSubUnitInfo(item, item.actualQty); const isMatch = item.qty === item.actualQty; return (<tr key={item.id}><td className="py-5 pl-4 text-center text-gray-400 text-sm">{index + 1}</td><td className="py-5"><p className={`${FONTS.header} text-gray-800 font-bold text-base`}>{item.name}</p><p className={`${FONTS.body} text-gray-500 text-xs mt-0.5`}>{item.barcode}</p></td><td className="py-5 text-right text-gray-500 text-sm">{item.qty} {item.unit}</td><td className="py-5 text-right text-gray-800 font-bold text-sm">{subUnitInfo.display}</td><td className="py-5 pr-4 text-center">{isMatch ? <CheckCircle className="inline text-emerald-500" size={18}/> : <AlertCircle className="inline text-red-500" size={18}/>}</td></tr>); })}</tbody></table>
                </div>
            </div>
        </div>
    );
};

// --- 3. PAYMENTS & BILLING ---

const PaymentListView = ({ onProceedToPayment }) => {
    const [selectedInvoices, setSelectedInvoices] = useState(new Set());
    const [filterSupplier, setFilterSupplier] = useState('All');
    const [filterDate, setFilterDate] = useState('');

    const uniqueSuppliers = ['All', ...new Set(MOCK_INVOICES.map(inv => inv.supplier))];

    const filteredInvoices = MOCK_INVOICES.filter(inv => {
        const matchSupplier = filterSupplier === 'All' || inv.supplier === filterSupplier;
        const matchDate = !filterDate || inv.date === filterDate;
        return matchSupplier && matchDate;
    });

    const handleSelect = (id) => {
        const newSet = new Set(selectedInvoices);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedInvoices(newSet);
    };

    const selectedTotal = filteredInvoices.filter(inv => selectedInvoices.has(inv.id)).reduce((sum, inv) => sum + inv.amount, 0);
    const handleCreateBilling = () => { onProceedToPayment(filteredInvoices.filter(inv => selectedInvoices.has(inv.id))); };

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] relative">
            <div className="px-8 py-6 border-b border-gray-200 bg-white">
                <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800 mb-4`}>รายการรอชำระเงิน (Payments)</h1>
                <div className="flex gap-4">
                    <div className="relative"><select className="pl-4 pr-10 py-2.5 border rounded-xl text-sm outline-none cursor-pointer min-w-[200px] bg-gray-50 border-gray-200 hover:bg-gray-100 font-medium text-gray-700" value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>{uniqueSuppliers.map(s => <option key={s} value={s}>{s === 'All' ? 'ผู้จัดจำหน่ายทั้งหมด' : s}</option>)}</select><ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} /></div>
                    <div className="relative"><input type="date" className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer hover:bg-gray-100 transition" value={filterDate} onChange={(e) => setFilterDate(e.target.value)} /><CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} /></div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar pb-32">
                <div className="space-y-4">
                    {filteredInvoices.map(inv => (
                        <div key={inv.id} className={`bg-white p-5 rounded-2xl border transition-all cursor-pointer flex items-center gap-5 group ${selectedInvoices.has(inv.id) ? 'border-emerald-500 bg-emerald-50/10 shadow-sm' : 'border-gray-200 hover:border-emerald-300 hover:shadow-sm'}`} onClick={() => handleSelect(inv.id)}>
                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedInvoices.has(inv.id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 group-hover:border-emerald-300'}`}><CheckSquare size={14} /></div>
                            <div className="flex-1"><div className="flex justify-between items-start mb-1"><h4 className={`${FONTS.header} font-bold text-gray-800 text-lg`}>{inv.supplier}</h4><span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{inv.status}</span></div><div className="flex items-center gap-4 text-sm text-gray-500"><span className="flex items-center gap-1"><FileText size={14}/> {inv.id}</span><span className="flex items-center gap-1 text-gray-400">Ref: {inv.grId}</span><span className="flex items-center gap-1"><ClockIcon size={14}/> Due: {inv.dueDate}</span></div></div>
                            <div className="text-right"><p className={`${FONTS.header} text-xl font-bold text-emerald-600`}>{inv.amount.toLocaleString()}</p><p className="text-xs text-gray-400">บาท</p></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-30"><div className="h-12 bg-gradient-to-t from-[#F9FAFB] to-transparent pointer-events-none"></div><div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 px-8 py-5 shadow-lg flex items-center justify-between"><div><p className="text-xs text-gray-500 font-bold mb-1">ยอดรวมที่เลือก</p><p className={`${FONTS.header} text-3xl font-bold text-emerald-600`}>{SYSTEM_DEFAULTS.currencySymbol}{selectedTotal.toLocaleString()}</p></div><button disabled={selectedInvoices.size === 0} onClick={handleCreateBilling} className={`px-8 py-3.5 rounded-2xl font-bold text-white shadow-xl transition-all transform active:scale-95 flex items-center gap-3 text-lg ${selectedInvoices.size > 0 ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20' : 'bg-gray-300 cursor-not-allowed shadow-none'}`}>สร้างใบวางบิล <ArrowLeft className="rotate-180" size={20} strokeWidth={3} /></button></div></div>
        </div>
    );
};

const PaymentProcessView = ({ invoices, onBack, onComplete }) => {
    const [step, setStep] = useState(1);
    const [paymentMethod, setPaymentMethod] = useState('Transfer');
    const [paymentDetails, setPaymentDetails] = useState({ bank: '', refNo: '', date: new Date().toISOString().split('T')[0] });
    const [isSuccess, setIsSuccess] = useState(false);
    const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    const handleConfirmPayment = () => { setIsSuccess(true); setTimeout(() => { onComplete(); }, 2000); };

    if (isSuccess) {
        return (
            <div className="flex items-center justify-center h-full bg-[#F9FAFB] animate-in fade-in"><div className="bg-white p-10 rounded-3xl shadow-xl text-center border border-gray-100 flex flex-col items-center"><div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300"><CheckCircle size={48} className="text-emerald-600" /></div><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 mb-2`}>บันทึกการชำระเงินเรียบร้อย</h2><p className="text-gray-500">ระบบกำลังนำคุณกลับไปหน้ารายการ...</p></div></div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB] relative">
            <div className="px-8 py-5 border-b border-gray-200 bg-white flex items-center gap-4 sticky top-0 z-20"><button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><ArrowLeft size={24}/></button><div className="flex-1"><h2 className={`${FONTS.header} text-xl font-bold text-gray-800 flex items-center gap-2`}>{step === 1 ? 'สร้างใบวางบิล (Billing Note)' : 'บันทึกการชำระเงิน (Payment)'}</h2><div className="flex gap-2 mt-1"><div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div><div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-gray-200'}`}></div></div></div></div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar"><div className="max-w-4xl mx-auto space-y-6"><div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"><h3 className={`${FONTS.header} font-bold text-gray-800 mb-4 flex items-center gap-2`}><FileText size={20} className="text-emerald-600"/> รายการเอกสาร</h3><div className="space-y-3">{invoices.map((inv, idx) => (<div key={inv.id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0"><div className="flex items-center gap-4"><span className="text-gray-400 w-6 text-center">{idx + 1}</span><div><p className="font-bold text-gray-700">{inv.id}</p><p className="text-gray-400 text-xs">{inv.supplier} • Due: {inv.dueDate}</p></div></div><span className="font-bold text-gray-700">{inv.amount.toLocaleString()}</span></div>))}</div><div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center"><span className="text-gray-500 font-bold">รวมเป็นเงินทั้งสิ้น</span><span className={`${FONTS.header} text-2xl font-bold text-emerald-600`}>{SYSTEM_DEFAULTS.currencySymbol}{totalAmount.toLocaleString()}</span></div></div>{step === 2 && (<div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 animate-in slide-in-from-bottom-4 duration-300"><h3 className={`${FONTS.header} font-bold text-gray-800 mb-6 flex items-center gap-2`}><CreditCard size={20} className="text-emerald-600"/> ข้อมูลการชำระเงิน</h3><div className="grid grid-cols-3 gap-4 mb-6">{['Transfer', 'Cheque', 'CreditCard'].map(m => (<button key={m} onClick={() => setPaymentMethod(m)} className={`py-3 rounded-xl border-2 font-bold text-sm flex flex-col items-center gap-2 transition-all ${paymentMethod === m ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-gray-100 hover:border-gray-300 text-gray-500'}`}>{m === 'Transfer' && <Banknote size={24}/>}{m === 'Cheque' && <FileText size={24}/>}{m === 'CreditCard' && <CreditCard size={24}/>}{m === 'Transfer' ? 'เงินโอน' : m === 'Cheque' ? 'เช็ค' : 'บัตรเครดิต'}</button>))}</div><div className="grid grid-cols-2 gap-6"><div><label className="block text-sm font-bold text-gray-700 mb-2">วันที่ชำระ</label><input type="date" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={paymentDetails.date} onChange={e => setPaymentDetails({...paymentDetails, date: e.target.value})} /></div><div><label className="block text-sm font-bold text-gray-700 mb-2">ธนาคาร</label><select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" value={paymentDetails.bank} onChange={e => setPaymentDetails({...paymentDetails, bank: e.target.value})}><option value="">เลือกธนาคาร...</option><option value="KBANK">กสิกรไทย (KBANK)</option><option value="SCB">ไทยพาณิชย์ (SCB)</option></select></div><div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Ref No.</label><input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none" placeholder="กรอกเลขที่อ้างอิง..." value={paymentDetails.refNo} onChange={e => setPaymentDetails({...paymentDetails, refNo: e.target.value})} /></div></div></div>)}</div></div>
            <div className="bg-white border-t border-gray-200 px-8 py-5 shadow-lg flex justify-end gap-3 sticky bottom-0 z-30">{step === 1 ? (<button onClick={() => setStep(2)} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition transform active:scale-95 flex items-center gap-2">ไปขั้นตอนชำระเงิน <ArrowLeft className="rotate-180" size={20}/></button>) : (<button onClick={handleConfirmPayment} className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 transition transform active:scale-95 flex items-center gap-2"><CheckCircle size={20}/> ยืนยันการชำระเงิน</button>)}</div>
        </div>
    );
};

// ==========================================
// ZONE E (Part 4): MARKETPLACE & MAIN PURCHASING MODULE
// ==========================================

// --- MARKETPLACE VIEW ---
const MarketplaceView = ({ products, addToPurchaseRequest, purchaseRequestItems, onGoToCart }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('ทั้งหมด');
    const [viewMode, setViewMode] = useState('list'); // list, grid
    const [filters, setFilters] = useState({ supplier: 'all', brand: 'all', category: 'all', animal: 'all' });
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [inputQuantities, setInputQuantities] = useState({});
    const [showFilters, setShowFilters] = useState(false);

    // Derived Data
    const uniqueSuppliers = ['all', ...new Set(products.map(p => p.supplier))];
    const uniqueBrands = ['all', ...new Set(products.map(p => p.brand))];
    const uniqueCategories = ['all', ...new Set(products.map(p => p.category))];

    const parseShelfLife = (str) => {
        if (!str || str === '-') return 0;
        return parseInt(str.replace(/[^\d]/g, '')) || 0;
    };  

    const getRecommendedQty = (product) => (product.stock <= product.stockPolicy.min) ? (product.stockPolicy.max - product.stock) : 0;

    const sortedProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm);
            const matchesSupplier = filters.supplier === 'all' || p.supplier === filters.supplier;
            const matchesBrand = filters.brand === 'all' || p.brand === filters.brand;
            const matchesCategory = filters.category === 'all' || p.category === filters.category;
            const matchesAnimal = filters.animal === 'all' || p.animal === filters.animal;
            
            let matchesTab = true;
            const isGeneric = p.brand === 'Generic';
            if (activeTab === 'นอกระบบ') matchesTab = isGeneric; 
            else if (activeTab === 'ใกล้หมด') matchesTab = p.stock <= p.stockPolicy.min && p.stock > 0; 
            else if (activeTab === 'หมด') matchesTab = p.stock === 0; 
            else if (activeTab === 'ค้างสต็อก') matchesTab = parseShelfLife(p.shelfLife) > 90; 

            return matchesSearch && matchesSupplier && matchesBrand && matchesCategory && matchesAnimal && matchesTab;
        });

        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                if (sortConfig.key === 'shelfLife') { aValue = parseShelfLife(a.shelfLife); bValue = parseShelfLife(b.shelfLife); }
                else if (sortConfig.key === 'stock') { aValue = a.stock; bValue = b.stock; }
                else if (typeof aValue === 'string') { aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase(); }
                
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [products, searchTerm, filters, activeTab, sortConfig]);

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const handleQuantityChange = (id, value) => {
        setInputQuantities(prev => ({...prev, [id]: parseInt(value) || 0}));
    };

    const tabs = [
        { id: 'ทั้งหมด', count: products.length },
        { id: 'นอกระบบ', count: products.filter(p => p.brand === 'Generic').length },
        { id: 'ใกล้หมด', count: products.filter(p => p.stock <= p.stockPolicy.min && p.stock > 0).length },
        { id: 'หมด', count: products.filter(p => p.stock === 0).length },
    ];

    return (
        <div className="flex flex-col h-full bg-[#F9FAFB]">
            {/* Header & Filters */}
            <div className="px-8 py-6 bg-white border-b border-gray-200 shadow-sm z-10">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>Marketplace (สั่งซื้อสินค้า)</h1>
                    <button onClick={onGoToCart} className="relative px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition shadow-lg flex items-center gap-2">
                        <ShoppingCart size={20} /> ตะกร้าสินค้า
                        {purchaseRequestItems.length > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{purchaseRequestItems.length}</span>}
                    </button>
                </div>

                <div className="flex flex-wrap gap-4 items-center mb-4">
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {tabs.map(tab => (
                            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {tab.id} <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-100 text-gray-600' : 'bg-gray-200 text-gray-500'}`}>{tab.count}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input type="text" placeholder="ค้นหาชื่อสินค้า, SKU, Barcode..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition" />
                    </div>
                    <button onClick={() => setShowFilters(!showFilters)} className={`p-2.5 rounded-xl border ${showFilters ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-white border-gray-200 text-gray-500'}`}><Filter size={20}/></button>
                    <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white">
                        <button onClick={() => setViewMode('list')} className={`p-2.5 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}><List size={20}/></button>
                        <div className="w-px bg-gray-200"></div>
                        <button onClick={() => setViewMode('grid')} className={`p-2.5 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}><Grid size={20}/></button>
                    </div>
                </div>

                {showFilters && (
                    <div className="flex gap-3 flex-wrap p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in slide-in-from-top-2">
                        <select className="px-3 py-2 rounded-lg border text-sm outline-none" value={filters.supplier} onChange={e => setFilters({...filters, supplier: e.target.value})}><option value="all">ทุกผู้จัดจำหน่าย</option>{uniqueSuppliers.filter(s => s !== 'all').map(s => <option key={s} value={s}>{s}</option>)}</select>
                        <select className="px-3 py-2 rounded-lg border text-sm outline-none" value={filters.brand} onChange={e => setFilters({...filters, brand: e.target.value})}><option value="all">ทุกยี่ห้อ</option>{uniqueBrands.filter(b => b !== 'all').map(b => <option key={b} value={b}>{b}</option>)}</select>
                        <select className="px-3 py-2 rounded-lg border text-sm outline-none" value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}><option value="all">ทุกหมวดหมู่</option>{uniqueCategories.filter(c => c !== 'all').map(c => <option key={c} value={c}>{c}</option>)}</select>
                        <div className="flex gap-1 ml-auto">{[{type:'dog', icon:'🐶'}, {type:'cat', icon:'🐱'}, {type:'all', icon:'All'}].map(a => (<button key={a.type} onClick={() => setFilters({...filters, animal: a.type})} className={`px-3 py-1.5 rounded-lg border text-sm ${filters.animal === a.type ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white border-gray-200'}`}>{a.icon}</button>))}</div>
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {viewMode === 'list' ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase border-b border-gray-200">
                                <tr>
                                    <th className="p-4 pl-6 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('name')}>สินค้า</th>
                                    <th className="p-4 cursor-pointer hover:bg-gray-100" onClick={() => handleSort('stock')}>สต็อกคงเหลือ</th>
                                    <th className="p-4 text-right cursor-pointer hover:bg-gray-100" onClick={() => handleSort('price')}>ต้นทุน/หน่วย</th>
                                    <th className="p-4 text-center">สถานะ</th>
                                    <th className="p-4 text-center">จำนวนสั่งซื้อ</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {sortedProducts.map(product => {
                                    const inCart = purchaseRequestItems.find(i => i.id === product.id);
                                    const qty = inputQuantities[product.id] || getRecommendedQty(product) || 1;
                                    return (
                                        <tr key={product.id} className="hover:bg-gray-50 group transition">
                                            <td className="p-4 pl-6">
                                                <div className="font-bold text-gray-800">{product.name}</div>
                                                <div className="text-xs text-gray-500">{product.brand} • {product.sku}</div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`${product.stock === 0 ? 'text-red-600 font-bold' : 'text-gray-700'}`}>{product.stock} {product.unit}</span>
                                                {product.stock <= product.stockPolicy.min && <span className="text-[10px] text-orange-500 block">Low Stock</span>}
                                            </td>
                                            <td className="p-4 text-right font-medium">{product.cost.toLocaleString()}</td>
                                            <td className="p-4 text-center">
                                                {product.stock === 0 ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-bold"><AlertCircle size={12}/> หมด</span> : 
                                                 product.stock <= product.stockPolicy.min ? <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-orange-100 text-orange-700 text-xs font-bold"><AlertTriangle size={12}/> ใกล้หมด</span> : 
                                                 <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-bold"><CheckCircle size={12}/> ปกติ</span>}
                                            </td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <input type="number" min="1" className="w-16 border border-gray-300 rounded-lg text-center py-1.5 focus:border-emerald-500 outline-none" value={qty} onChange={(e) => handleQuantityChange(product.id, e.target.value)} />
                                                    <span className="text-xs text-gray-400">{product.unit}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => addToPurchaseRequest(product, qty)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition shadow-sm ${inCart ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-900 hover:text-white'}`}>
                                                    {inCart ? <Check size={20} /> : <Plus size={20} />}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-20">
                        {sortedProducts.map(product => {
                            const inCart = purchaseRequestItems.find(i => i.id === product.id);
                            const qty = inputQuantities[product.id] || getRecommendedQty(product) || 1;
                            return (
                                <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-300 transition flex flex-col group">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">{product.brand}</span>
                                        {product.stock <= product.stockPolicy.min && <AlertTriangle className="text-orange-500" size={16} />}
                                    </div>
                                    <div className="flex-1 mb-4">
                                        <h3 className="font-bold text-gray-800 text-sm leading-tight mb-1 line-clamp-2">{product.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono">{product.sku}</p>
                                    </div>
                                    <div className="flex justify-between items-end mb-3">
                                        <div><p className="text-xs text-gray-400">สต็อก</p><p className={`font-bold ${product.stock===0?'text-red-600':'text-gray-800'}`}>{product.stock} {product.unit}</p></div>
                                        <div className="text-right"><p className="text-xs text-gray-400">ทุน</p><p className="font-bold text-emerald-600">{product.cost}</p></div>
                                    </div>
                                    <div className="flex gap-2 mt-auto">
                                        <input type="number" className="w-1/2 border border-gray-200 rounded-lg text-center text-sm focus:border-emerald-500 outline-none" value={qty} onChange={(e) => handleQuantityChange(product.id, e.target.value)} />
                                        <button onClick={() => addToPurchaseRequest(product, qty)} className={`flex-1 rounded-lg flex items-center justify-center transition ${inCart ? 'bg-emerald-600 text-white' : 'bg-gray-900 text-white hover:bg-black'}`}>
                                            {inCart ? <Check size={18} /> : <Plus size={18} />}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CART VIEW (With Approval) ---
const CartView = ({ items, onUpdateQty, onRemove, onSelect, selectedItems, onSelectAll, onCheckout }) => {
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [approvalPassword, setApprovalPassword] = useState('');
    const [approvalError, setApprovalError] = useState('');

    const handleInitiateCheckout = () => {
        const itemsToCheckout = items.filter(i => selectedItems.has(i.id));
        if (itemsToCheckout.length === 0) return;
        setIsApprovalModalOpen(true);
        setApprovalPassword('');
        setApprovalError('');
    };

    const handleConfirmApproval = () => {
        if (approvalPassword === '1234') { 
            setIsApprovalModalOpen(false);
            const itemsToCheckout = items.filter(i => selectedItems.has(i.id));
            if (onCheckout) onCheckout(itemsToCheckout);
        } else {
            setApprovalError('รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่');
        }
    };

    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.supplier]) acc[item.supplier] = [];
        acc[item.supplier].push(item);
        return acc;
    }, {});

    const totalSelected = items.filter(i => selectedItems.has(i.id)).reduce((sum, i) => sum + ((i.cost || 0) * i.qty), 0);
    const allSelected = items.length > 0 && selectedItems.size === items.length;

    return (
        <div className="flex flex-col h-full w-full bg-[#F3F4F6] relative overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
                {Object.keys(groupedItems).length > 0 ? Object.entries(groupedItems).map(([supplier, supplierItems]) => {
                    const isSupplierAllSelected = supplierItems.every(i => selectedItems.has(i.id));
                    return (
                        <div key={supplier} className="bg-white rounded-3xl shadow-sm border border-gray-200/60 overflow-hidden">
                            <div className="px-6 py-4 bg-gray-50/80 border-b border-gray-100 flex justify-between items-center backdrop-blur-sm">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => { const ids = supplierItems.map(i => i.id); onSelect(ids, !isSupplierAllSelected); }} className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${isSupplierAllSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 hover:border-emerald-300'}`}><Check size={12} strokeWidth={4} /></button>
                                    <h3 className={`${FONTS.header} font-bold text-gray-800 text-lg tracking-tight`}>{supplier}</h3>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {supplierItems.map(item => {
                                    const isSelected = selectedItems.has(item.id);
                                    return (
                                        <div key={item.id} className={`p-6 flex gap-6 items-start transition-all duration-200 group ${isSelected ? 'bg-emerald-50/10' : 'hover:bg-gray-50/50'}`}>
                                            <div className="pt-3"><button onClick={() => onSelect([item.id], !isSelected)} className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 hover:border-emerald-300'}`}><Check size={12} strokeWidth={4} /></button></div>
                                            <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-4xl border border-gray-100 shadow-sm">{item.img || '📦'}</div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between mb-2"><div><h4 className="font-bold text-gray-800">{item.name}</h4><p className="text-xs text-gray-500">{item.brand} • {item.sku}</p></div><div className="text-right"><p className="font-bold text-emerald-600 text-lg">฿{(item.cost * item.qty).toLocaleString()}</p><p className="text-xs text-gray-400">@{item.cost}/{item.unit}</p></div></div>
                                                <div className="flex items-center gap-4 justify-end">
                                                    <div className="flex items-center bg-white border border-gray-200 rounded-lg h-9"><button onClick={() => onUpdateQty(item.id, Math.max(1, item.qty - 1))} className="w-9 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-l-lg"><Minus size={14}/></button><input type="text" value={item.qty} readOnly className="w-12 text-center text-sm font-bold text-gray-700 outline-none" /><button onClick={() => onUpdateQty(item.id, item.qty + 1)} className="w-9 h-full flex items-center justify-center text-gray-400 hover:bg-gray-50 rounded-r-lg"><Plus size={14}/></button></div>
                                                    <button onClick={() => onRemove(item.id)} className="p-2 text-gray-300 hover:text-red-500 rounded-lg transition"><Trash2 size={18} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400"><ShoppingBasket size={64} className="mb-4 opacity-20" /><p className="text-lg font-medium">ตะกร้าว่างเปล่า</p></div>
                )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-xl border-t border-gray-200 px-8 py-5 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] flex items-center justify-between">
                <div className="flex items-center gap-4"><button onClick={() => onSelectAll(!allSelected)} className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${allSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 hover:border-emerald-300'}`}><Check size={12} strokeWidth={4} /></button><div><span className="font-bold text-gray-700">เลือกทั้งหมด</span> <span className="text-xs text-gray-400">({items.length} รายการ)</span></div></div>
                <div className="flex items-center gap-8"><div className="text-right"><p className="text-xs text-gray-500 font-bold mb-0.5">ยอดรวมสุทธิ</p><p className="text-3xl font-bold text-emerald-600">฿{totalSelected.toLocaleString()}</p></div><button onClick={handleInitiateCheckout} disabled={totalSelected === 0} className={`px-10 py-4 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 flex items-center gap-3 text-lg ${totalSelected > 0 ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-300 cursor-not-allowed'}`}>สั่งซื้อสินค้า <ArrowLeft className="rotate-180" size={22} strokeWidth={3} /></button></div>
            </div>
            {isApprovalModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"><div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsApprovalModalOpen(false)}></div><div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10 animate-in zoom-in-95 duration-200"><div className="bg-slate-900 p-6 flex justify-between items-start"><div><h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2"><ShieldCheck size={24} className="text-emerald-400" /> ยืนยันคำสั่งซื้อ</h3><p className="text-slate-400 text-sm">กรุณาใส่รหัสผ่านผู้อนุมัติเพื่อดำเนินการต่อ</p></div><button onClick={() => setIsApprovalModalOpen(false)} className="text-slate-400 hover:text-white transition"><X size={24} /></button></div><div className="p-8"><div className="mb-6"><label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่าน (Password)</label><div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} /><input type="password" autoFocus className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 outline-none transition text-lg tracking-widest" placeholder="••••••" value={approvalPassword} onChange={(e) => setApprovalPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirmApproval()} /></div>{approvalError && (<p className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-in slide-in-from-top-1"><AlertCircle size={14} /> {approvalError}</p>)}</div><div className="flex gap-3"><button onClick={() => setIsApprovalModalOpen(false)} className="flex-1 py-3.5 border border-slate-200 rounded-xl text-slate-600 font-bold hover:bg-slate-50 transition">ยกเลิก</button><button onClick={handleConfirmApproval} className="flex-1 py-3.5 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition transform active:scale-95">ยืนยันอนุมัติ</button></div></div></div></div>
            )}
        </div>
    );
};

// --- UPDATED PURCHASING MODULE ---
const PurchasingModule = ({ products, handleNavigate, setIsDrawerOpen, purchaseRequestItems, addToPurchaseRequest }) => {
    const [activePage, setActivePage] = useState('overview'); 
    const [purchaseOrders, setPurchaseOrders] = useState(MOCK_PURCHASE_ORDERS);
	const pendingCount = purchaseOrders.filter(po => po.status === 'Pending').length; // 1. คำนวณจำนวนบิลที่สถานะเป็น Pending (เพิ่มบรรทัดนี้ก่อน return)
	const [poItems, setPoItems] = useState([]); 
    const [selectedPO, setSelectedPO] = useState(null); 
    const [selectedGR, setSelectedGR] = useState(null); // Selected Goods Receipt
    const pendingPOCount = purchaseOrders.filter(p => p.status === 'Pending').length;
    // Payment State
    const [paymentInvoices, setPaymentInvoices] = useState([]);
	const [goodsReceipts, setGoodsReceipts] = useState(MOCK_GOODS_RECEIPTS || []); 
    const handleUpdatePOStatus = (poId, newStatus) => {
        // 1. อัปเดตสถานะในรายการใบสั่งซื้อ
        setPurchaseOrders(prev => prev.map(po => {
            if (po.id === poId) {
                return { ...po, status: newStatus };
            }
            return po;
        }));

        // 2. ถ้าเลือกเป็น 'Received' ให้สร้างใบรับสินค้า (Goods Receipt) อัตโนมัติ
        if (newStatus === 'Received') {
            const targetPO = purchaseOrders.find(p => p.id === poId);
            
            // ป้องกันการสร้างซ้ำ (เช็คว่ามี GR ของ PO นี้หรือยัง)
            const existingGR = goodsReceipts.find(gr => gr.poId === poId);
            
            if (targetPO && !existingGR) {
                const newGR = {
                    id: `GR-${new Date().getFullYear()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
                    poId: targetPO.id,
                    date: new Date().toLocaleDateString('en-GB'),
                    supplier: targetPO.supplier,
                    totalItems: targetPO.items.reduce((sum, item) => sum + item.qty, 0),
                    status: 'Pending Inspection', // สถานะเริ่มต้นของใบรับ
                    items: [...targetPO.items]
                };

                setGoodsReceipts(prev => [newGR, ...prev]);
                alert(`สร้างใบรับสินค้า (Goods Receipt) สำหรับ ${poId} เรียบร้อยแล้ว!`);
            }
        }
    };

    // =========================================================================
    // [NEW FUNCTION] Logic: แยกบิลตาม Supplier + เรียง Barcode + เพิ่มสถานะส่ง
    // =========================================================================
    const handleCheckout = (items) => {
        if (!items || items.length === 0) return;

        // 1. จัดกลุ่มสินค้าตาม Supplier
        const groupedItems = items.reduce((acc, item) => {
            const supplierName = item.supplier || 'Unknown Supplier';
            if (!acc[supplierName]) acc[supplierName] = [];
            acc[supplierName].push(item);
            return acc;
        }, {});

        const newPOs = [];

        // 2. วนลูปแต่ละ Supplier เพื่อสร้างบิล
        Object.entries(groupedItems).forEach(([supplier, supplierItems]) => {
            
            // 3. เรียงรายการสินค้าตาม Barcode (น้อยไปมาก)
            supplierItems.sort((a, b) => {
                const barA = a.barcode || '';
                const barB = b.barcode || '';
                return barA.localeCompare(barB);
            });

            // สร้าง ID สุ่ม (ในระบบจริงควรมาจาก Database)
            const randomId = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
            const newId = `PO-${new Date().getFullYear()}${(new Date().getMonth()+1).toString().padStart(2,'0')}-${randomId}`;
            
            // คำนวณยอดรวมเฉพาะบิลนี้
            const totalAmount = supplierItems.reduce((sum, item) => sum + (item.cost * item.qty), 0);

            // สร้าง Object ใบสั่งซื้อ
            const newPO = {
                id: newId,
                date: new Date().toLocaleDateString('en-GB'),
                supplier: supplier, // ระบุ Supplier แยกตามจริง
                total: totalAmount,
                status: 'Pending',
                isSent: false, // [NEW] สถานะการส่ง Email/Line (เริ่มต้นคือยังไม่ส่ง)
                items: [...supplierItems]
            };

            newPOs.push(newPO);
        });

        // 4. อัปเดต State: เอาบิลใหม่ทั้งหมดไปแทรกไว้หน้าสุด
        setPurchaseOrders(prev => [...newPOs, ...prev]);

        // 5. เคลียร์ตะกร้า
        items.forEach(item => addToPurchaseRequest(item, 0));

        // 6. เปลี่ยนหน้าไปที่รายการใบสั่งซื้อ
        setActivePage('purchase_orders');
    };

    // [NEW FUNCTION] ฟังก์ชันจำลองการกดส่ง Email/Line
    const handleSendPO = (poId, method) => {
        // อัปเดตสถานะ isSent ของบิลนั้นให้เป็น true
        setPurchaseOrders(prev => prev.map(po => {
            if (po.id === poId) {
                // แจ้งเตือนเล็กน้อย
                // alert(`ส่งใบสั่งซื้อ ${poId} ทาง ${method} เรียบร้อยแล้ว`);
                return { ...po, isSent: true }; // ปุ่มจะหายไปเพราะค่านี้
            }
            return po;
        }));
    };

    // Handle View Existing PO from List
    const handleViewPO = (po) => {
        setPoItems(po.items);
        setSelectedPO(po);
        setActivePage('purchase_order_detail');
    };

    const handleViewGR = (gr) => {
        setSelectedGR(gr);
        setActivePage('goods_receipt_detail');
    }

    // Payment Handlers
    const handleProceedToPayment = (invoices) => {
        setPaymentInvoices(invoices);
        setActivePage('payment_process');
    };

    const handlePaymentComplete = () => {
        setActivePage('payments');
        // Logic to update invoice status would go here
    };

    const handleBackFromDetail = () => {
        if (activePage === 'purchase_order_detail') {
             if (selectedPO) setActivePage('purchase_orders');
             else setActivePage('cart');
        } else if (activePage === 'goods_receipt_detail') {
             setActivePage('goods_receipts');
        }
    };

    // ... existing state & effects ...
    const [activeTab, setActiveTab] = useState('ทั้งหมด');
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState('list'); 
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [filters, setFilters] = useState({ supplier: 'all', brand: 'all', category: 'all', subCategory: 'all', animal: 'all' });
    const [filterDropdowns, setFilterDropdowns] = useState({ supplier: false, brand: false, category: false, subCategory: false });
    const dropdownRef = useRef(null);
    const [selectedItems, setSelectedItems] = useState(new Set());
    const [inputQuantities, setInputQuantities] = useState({});

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setFilterDropdowns({ supplier: false, brand: false, category: false, subCategory: false });
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef]);

    const uniqueSuppliers = [...new Set(products.map(p => p.supplier))];
    const uniqueBrands = [...new Set(products.map(p => p.brand))];
    const uniqueCategories = [...new Set(products.map(p => p.category))];
    const uniqueSubCategories = [...new Set(products.map(p => p.subCategory))];

    const parseShelfLife = (str) => {
        if (!str || str === '-') return 0;
        return parseInt(str.replace(/[^\d]/g, '')) || 0;
    };    

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const sortedProducts = useMemo(() => {
        let result = products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm) || p.sku.toLowerCase().includes(searchTerm);
            const matchesSupplier = filters.supplier === 'all' || p.supplier === filters.supplier;
            const matchesBrand = filters.brand === 'all' || p.brand === filters.brand;
            const matchesCategory = filters.category === 'all' || p.category === filters.category;
            const matchesSubCategory = filters.subCategory === 'all' || p.subCategory === filters.subCategory;
            const matchesAnimal = filters.animal === 'all' || p.animal === filters.animal;
            let matchesTab = true;
            const isGeneric = p.brand === 'Generic';
            if (activeTab === 'นอกระบบ') matchesTab = isGeneric; 
            else if (activeTab === 'ใกล้หมด') matchesTab = p.stock <= p.stockPolicy.min && p.stock > 0 && !isGeneric; 
            else if (activeTab === 'หมด') matchesTab = p.stock === 0 && !isGeneric; 
            else if (activeTab === 'ค้างสต็อก') matchesTab = parseShelfLife(p.shelfLife) > 90; 
            return matchesSearch && matchesSupplier && matchesBrand && matchesCategory && matchesSubCategory && matchesAnimal && matchesTab;
        });

        if (sortConfig.key !== null) {
            result.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];
                if (sortConfig.key === 'shelfLife') { aValue = parseShelfLife(a.shelfLife); bValue = parseShelfLife(b.shelfLife); }
                else if (sortConfig.key === 'alert') {
                     const getStatus = (p) => { if (p.stock === 0) return 1; if (p.stock <= p.stockPolicy.min) return 2; return 3; };
                     aValue = getStatus(a); bValue = getStatus(b);
                } else if (typeof aValue === 'string') { aValue = aValue.toLowerCase(); bValue = bValue.toLowerCase(); }
                if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [products, searchTerm, filters, activeTab, sortConfig]);

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

    const toggleFilterDropdown = (key) => setFilterDropdowns(prev => ({ supplier: false, brand: false, category: false, subCategory: false, [key]: !prev[key] }));
    const handleQuantityChange = (id, value) => setInputQuantities(prev => ({...prev, [id]: parseInt(value) || 0}));
    const getRecommendedQty = (product) => (product.stock <= product.stockPolicy.min) ? (product.stockPolicy.max - product.stock) : 0;
    
    const togglePurchaseRequestItem = (product, quantity) => {
        const exists = purchaseRequestItems.find(p => p.id === product.id);
        if (exists) {
             addToPurchaseRequest(product, 0); 
        } else {
            addToPurchaseRequest(product, quantity > 0 ? quantity : 1);
        }
    };

    const handleUpdateCartQty = (id, qty) => { const product = products.find(p => p.id === id); if(product) addToPurchaseRequest(product, qty); };
    const handleRemoveFromCart = (id) => { const product = products.find(p => p.id === id); if(product) addToPurchaseRequest(product, 0); };
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
            <PurchasingSidebar 
                onOpenDrawer={() => setIsDrawerOpen(true)} 
                onNavigate={handleNavigate} 
                activePage={activePage === 'purchase_order_detail' ? 'cart' : activePage}
                onChangePage={setActivePage} 
                cartItemCount={purchaseRequestItems.length}
                pendingCount={pendingCount} 
            />
            <div className="flex-1 flex flex-col min-w-0">
                {activePage === 'marketplace' ? (
                    <MarketplaceView 
                        products={products} 
                        addToPurchaseRequest={togglePurchaseRequestItem} 
                        purchaseRequestItems={purchaseRequestItems} 
                        onGoToCart={() => setActivePage('cart')}
                    />
                ) : activePage === 'purchase_orders' ? (
                    <PurchaseOrderListView onSelectPO={handleViewPO} orders={purchaseOrders} onSendPO={handleSendPO} onUpdateStatus={handleUpdatePOStatus}/>
                ) : activePage === 'purchase_order_detail' ? (
                    <PurchaseOrderDetailView items={poItems} poData={selectedPO} onClose={handleBackFromDetail} />
                ) : activePage === 'goods_receipts' ? (
                    <GoodsReceiptListView onSelectGR={handleViewGR}	receipts={goodsReceipts} />
                ) : activePage === 'goods_receipt_detail' ? (
                    <GoodsReceiptDetailView grData={selectedGR} onClose={handleBackFromDetail} />
                ) : activePage === 'payments' ? (
                    <PaymentListView onProceedToPayment={handleProceedToPayment} />
                ) : activePage === 'payment_process' ? (
                    <PaymentProcessView invoices={paymentInvoices} onBack={() => setActivePage('payments')} onComplete={handlePaymentComplete} />
                ) : (
                    <>
                        {/* Overview Header ... */}
                        <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-between shrink-0 relative z-30">
                        {activePage === 'overview' ? (
                            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"><h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ภาพรวมคลังสินค้า</h1></div>
                        ) : (
                            <div className="flex items-center gap-4"><button onClick={() => setActivePage('overview')} className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={24} className="text-gray-600" /></button><h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ตะกร้าสินค้า</h1></div>
                        )}
                        {activePage === 'overview' && (
                            <div className="ml-auto relative w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="text" placeholder="ค้นหา" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:border-yellow-400 focus:outline-none transition`} /></div>
                        )}
                        </header>

                        {activePage === 'overview' ? (
                            <div className="flex-1 p-8 overflow-hidden flex flex-col">
                                {/* ... Overview Logic (Tabs, Filters, Table/Grid) ... */}
                                <div className="flex justify-between items-center mb-6">
                                    <div className="flex gap-2">{tabs.map(tab => (<button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-full text-sm font-bold transition flex items-center gap-2 ${activeTab === tab.id ? 'bg-gray-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'}`}>{tab.label}<span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{tab.count}</span></button>))}</div>
                                    <button onClick={() => setActivePage('cart')} className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm relative group"><ShoppingCart size={18} className="text-gray-500 group-hover:text-emerald-500 transition" />ตะกร้า{purchaseRequestItems.length > 0 && (<span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center border-2 border-white">{purchaseRequestItems.length}</span>)}</button>
                                </div>
                                <div className="flex flex-wrap items-center gap-3 mb-6" ref={dropdownRef}>
                                    <div className="relative"><button onClick={() => toggleFilterDropdown('supplier')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">{filters.supplier === 'all' ? 'ผู้จัดจำหน่าย' : filters.supplier} <ChevronDown size={14} /></button>{filterDropdowns.supplier && (<div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"><button onClick={() => {setFilters({...filters, supplier: 'all'}); setFilterDropdowns({...filterDropdowns, supplier: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>{uniqueSuppliers.map(s => <button key={s} onClick={() => {setFilters({...filters, supplier: s}); setFilterDropdowns({...filterDropdowns, supplier: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}</div>)}</div>
                                    <div className="relative"><button onClick={() => toggleFilterDropdown('brand')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">{filters.brand === 'all' ? 'ยี่ห้อสินค้า' : filters.brand} <ChevronDown size={14} /></button>{filterDropdowns.brand && (<div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"><button onClick={() => {setFilters({...filters, brand: 'all'}); setFilterDropdowns({...filterDropdowns, brand: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>{uniqueBrands.map(s => <button key={s} onClick={() => {setFilters({...filters, brand: s}); setFilterDropdowns({...filterDropdowns, brand: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}</div>)}</div>
                                    <div className="relative"><button onClick={() => toggleFilterDropdown('category')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">{filters.category === 'all' ? 'กลุ่มสินค้า' : filters.category} <ChevronDown size={14} /></button>{filterDropdowns.category && (<div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"><button onClick={() => {setFilters({...filters, category: 'all'}); setFilterDropdowns({...filterDropdowns, category: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>{uniqueCategories.map(s => <button key={s} onClick={() => {setFilters({...filters, category: s}); setFilterDropdowns({...filterDropdowns, category: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}</div>)}</div>
                                    <div className="relative"><button onClick={() => toggleFilterDropdown('subCategory')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-200 transition min-w-[120px] justify-between">{filters.subCategory === 'all' ? 'กลุ่มสินค้าย่อย' : filters.subCategory} <ChevronDown size={14} /></button>{filterDropdowns.subCategory && (<div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 max-h-60 overflow-y-auto custom-scrollbar"><button onClick={() => {setFilters({...filters, subCategory: 'all'}); setFilterDropdowns({...filterDropdowns, subCategory: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">ทั้งหมด</button>{uniqueSubCategories.map(s => <button key={s} onClick={() => {setFilters({...filters, subCategory: s}); setFilterDropdowns({...filterDropdowns, subCategory: false})}} className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">{s}</button>)}</div>)}</div>
                                    <div className="h-8 w-px bg-gray-300 mx-2"></div>
                                    <div className="flex gap-1">{PURCHASING_ANIMAL_FILTERS.map((a, i) => (<button key={i} onClick={() => setFilters({...filters, animal: filters.animal === a.type ? 'all' : a.type})} className={`w-9 h-9 rounded-lg border flex items-center justify-center text-lg transition ${filters.animal === a.type ? 'bg-yellow-100 border-yellow-400' : 'bg-white hover:bg-gray-50 border-gray-200'}`}>{a.icon}</button>))}</div>
                                    <div className="ml-auto flex gap-2"><button onClick={() => setViewMode('list')} className={`p-2 border rounded-lg hover:text-gray-900 transition ${viewMode === 'list' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white text-gray-400 border-gray-200'}`}><List size={20} /></button><button onClick={() => setViewMode('grid')} className={`p-2 border rounded-lg hover:text-gray-900 transition ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900 border-gray-300' : 'bg-white text-gray-400 border-gray-200'}`}><Grid size={20} /></button></div>
                                </div>

                                {viewMode === 'list' ? (
                                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                        <div className="overflow-y-auto flex-1 custom-scrollbar">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50 sticky top-0 z-10 text-xs text-gray-500 uppercase select-none">
                                                    <tr>
                                                        <th className="p-4 pl-6 font-bold cursor-pointer group hover:bg-gray-100 transition" onClick={() => handleSort('name')}><div className="flex items-center gap-1">ชื่อ {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-gray-800"/> : <ChevronDown size={14} className="text-gray-800"/>) : <div className="opacity-0 group-hover:opacity-30"><ChevronUp size={14}/></div>}</div></th>
                                                        <th className="p-4 font-bold cursor-pointer group hover:bg-gray-100 transition" onClick={() => handleSort('barcode')}><div className="flex items-center gap-1">Barcode {sortConfig.key === 'barcode' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-gray-800"/> : <ChevronDown size={14} className="text-gray-800"/>) : <div className="opacity-0 group-hover:opacity-30"><ChevronUp size={14}/></div>}</div></th>
                                                        <th className="p-4 font-bold cursor-pointer group hover:bg-gray-100 transition" onClick={() => handleSort('price')}><div className="flex items-center gap-1">ราคา {sortConfig.key === 'price' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-gray-800"/> : <ChevronDown size={14} className="text-gray-800"/>) : <div className="opacity-0 group-hover:opacity-30"><ChevronUp size={14}/></div>}</div></th>
                                                        <th className="p-4 font-bold cursor-pointer group hover:bg-gray-100 transition" onClick={() => handleSort('stock')}><div className="flex items-center gap-1">สต็อก {sortConfig.key === 'stock' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-gray-800"/> : <ChevronDown size={14} className="text-gray-800"/>) : <div className="opacity-0 group-hover:opacity-30"><ChevronUp size={14}/></div>}</div></th>
                                                        <th className="p-4 font-bold text-center cursor-pointer group hover:bg-gray-100 transition" onClick={() => handleSort('alert')}><div className="flex items-center justify-center gap-1">แจ้งเตือน {sortConfig.key === 'alert' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-gray-800"/> : <ChevronDown size={14} className="text-gray-800"/>) : <div className="opacity-0 group-hover:opacity-30"><ChevronUp size={14}/></div>}</div></th>
                                                        <th className="p-4 font-bold cursor-pointer group hover:bg-gray-100 transition" onClick={() => handleSort('shelfLife')}><div className="flex items-center gap-1">SHELF LIFE {sortConfig.key === 'shelfLife' ? (sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-gray-800"/> : <ChevronDown size={14} className="text-gray-800"/>) : <div className="opacity-0 group-hover:opacity-30"><ChevronUp size={14}/></div>}</div></th>
                                                        <th className="p-4 font-bold text-center">จำนวนแนะนำให้ซื้อ</th>
                                                        <th className="p-4 font-bold"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-50 text-sm">
                                                    {sortedProducts.map((product) => {
                                                        const isInRequest = purchaseRequestItems.some(item => item.id === product.id);
                                                        const recommendQty = getRecommendedQty(product);
                                                        const inputQty = inputQuantities[product.id] !== undefined ? inputQuantities[product.id] : recommendQty;
                                                        return (
                                                            <tr key={product.id} className="hover:bg-gray-50 transition group">
                                                                <td className="p-4 pl-6"><div className="font-bold text-gray-800">{product.name}</div><div className="text-xs text-gray-400">{product.brand}</div></td>
                                                                <td className="p-4"><div className="text-gray-800 font-mono text-xs">{product.barcode}</div><div className="text-gray-400 text-[10px]">{product.sku}</div></td>
                                                                <td className="p-4 text-gray-800 font-medium">{product.price} บาท</td>
                                                                <td className="p-4 text-gray-800">{product.stock} {product.unit}</td>
                                                                <td className="p-4 text-center">{product.stock === 0 ? <AlertCircle className="text-red-500 mx-auto" size={18} /> : product.stock <= product.stockPolicy.min ? <AlertTriangle className="text-orange-500 mx-auto" size={18} /> : <CheckCircle className="text-green-500 mx-auto" size={18} />}</td>
                                                                <td className="p-4 text-gray-600">{product.shelfLife}</td>
                                                                <td className="p-4 text-center"><input type="number" value={inputQty} onChange={(e) => handleQuantityChange(product.id, e.target.value)} className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-center text-gray-700 focus:border-yellow-400 outline-none" /></td>
                                                                <td className="p-4 text-right"><button onClick={() => togglePurchaseRequestItem(product, inputQty)} className={`w-9 h-9 flex items-center justify-center rounded-lg transition shadow-sm ${isInRequest ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-900 text-white hover:bg-black'}`}>{isInRequest ? <Check size={18} /> : <Plus size={18} />}</button></td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-y-auto flex-1 custom-scrollbar pb-4">
                                        {sortedProducts.map((product) => {
                                            const isInRequest = purchaseRequestItems.some(item => item.id === product.id);
                                            const recommendQty = getRecommendedQty(product);
                                            const inputQty = inputQuantities[product.id] !== undefined ? inputQuantities[product.id] : recommendQty;
                                            return (
                                                <div key={product.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
                                                    <div className="flex justify-between items-start mb-2"><div className="bg-gray-100 text-xs px-2 py-1 rounded-md text-gray-600">{product.brand}</div>{product.stock <= product.stockPolicy.min && <AlertTriangle size={16} className="text-orange-500" />}</div>
                                                    <h3 className="font-bold text-gray-800 text-sm mb-1 line-clamp-2 h-10">{product.name}</h3>
                                                    <div className="text-xs text-gray-500 mb-4 font-mono">{product.barcode}</div>
                                                    <div className="flex justify-between items-center text-sm mb-2"><span className="text-gray-500">สต็อก</span><span className={`font-bold ${product.stock === 0 ? 'text-red-500' : 'text-gray-800'}`}>{product.stock} {product.unit}</span></div>
                                                    <div className="flex justify-between items-center text-sm mb-4"><span className="text-gray-500">ราคา</span><span className="font-bold text-gray-800">{product.price}</span></div>
                                                    <div className="mt-auto flex items-center gap-2"><input type="number" value={inputQty} onChange={(e) => handleQuantityChange(product.id, e.target.value)} className="w-full px-2 py-2 border border-gray-200 rounded-lg text-center text-gray-700 text-sm focus:border-yellow-400 outline-none" /><button onClick={() => togglePurchaseRequestItem(product, inputQty)} className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-lg transition ${isInRequest ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-gray-900 text-white hover:bg-black'}`}>{isInRequest ? <Check size={18} /> : <Plus size={18} />}</button></div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <CartView 
                                items={purchaseRequestItems} 
                                onUpdateQty={handleUpdateCartQty} 
                                onRemove={handleRemoveFromCart}
                                onSelect={handleSelectItems}
                                selectedItems={selectedItems}
                                onSelectAll={handleSelectAll}
                                onCheckout={handleCheckout} 
                           />
                       )}
                    </>
                )}
            </div>
        </div>
    );
};

// ==========================================
// ZONE E (Part 5): CRM FEATURES
// ==========================================

const CRMSettingsView = () => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F9FAFB]">
             <header className="mb-8 flex items-center gap-3">
                 <div className="p-3 bg-[#FCD34D] rounded-xl text-gray-900"><Settings size={28} /></div>
                 <h1 className={`${FONTS.header} text-3xl font-bold text-gray-800`}>ตั้งค่าระบบ CRM</h1>
             </header>

             <div className="max-w-4xl space-y-6">
                 {/* Card 1: Point Exchange */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                         <h3 className={`${FONTS.header} text-lg font-bold text-gray-800`}>ตั้งค่าการแลกคะแนน</h3>
                         <button className="text-yellow-600 hover:text-yellow-700 font-bold text-sm underline">แก้ไข</button>
                     </div>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center py-2">
                             <span className="text-gray-500">การแลกแต้ม</span>
                             <span className="font-medium text-gray-800">สะสมตามยอดทุกๆ 50 บาท = 1 แต้ม</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-t border-gray-50">
                             <span className="text-gray-500">แต้มแรกเข้า</span>
                             <span className="font-medium text-gray-800">ไม่มี</span>
                         </div>
                         <div className="flex justify-between items-center py-2 border-t border-gray-50">
                             <span className="text-gray-500">อายุคะแนน</span>
                             <span className="font-medium text-gray-800">ไม่มีกำหนด</span>
                         </div>
                     </div>
                 </div>

                 {/* Card 2: Member Level */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                         <h3 className={`${FONTS.header} text-lg font-bold text-gray-800`}>ตั้งค่าระดับสมาชิก</h3>
                         <button className="text-yellow-600 hover:text-yellow-700 font-bold text-sm underline">แก้ไข</button>
                     </div>
                     <div className="space-y-4">
                         {[
                            { range: '0 - 100 บาท', label: 'รุ่นหลาน', color: 'bg-green-100' },
                            { range: '501 - 9,999 บาท', label: 'รุ่นลูก', color: 'bg-orange-100' },
                            { range: '10,001 - 50,000 บาท', label: 'รุ่นตำนาน', color: 'bg-purple-100' }
                         ].map((level, i) => (
                             <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50 bg-gray-50/50">
                                 <div className={`w-12 h-12 rounded-lg ${level.color} flex items-center justify-center text-xl`}>🍰</div>
                                 <div className="flex-1">
                                     <p className="font-bold text-gray-800 text-sm">{level.range}</p>
                                     <p className="text-xs text-gray-500">= {level.label}</p>
                                 </div>
                             </div>
                         ))}
                         <div className="flex justify-between items-center py-2 mt-4 pt-4 border-t border-gray-100">
                             <span className="text-gray-500">จัดลำดับใหม่ทุกๆ</span>
                             <span className="font-medium text-gray-800">01-01-1970</span>
                         </div>
                     </div>
                 </div>

                 {/* Card 3: Registration */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                     <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                         <h3 className={`${FONTS.header} text-lg font-bold text-gray-800`}>ตั้งค่าการสมัครสมาชิก</h3>
                         <button className="text-yellow-600 hover:text-yellow-700 font-bold text-sm underline">แก้ไข</button>
                     </div>
                     <div className="space-y-4">
                         <div className="flex justify-between items-center py-2">
                             <span className="text-gray-500">รูปแบบบัตร</span>
                             <span className="font-medium text-gray-800">-</span>
                         </div>
                     </div>
                 </div>

                 {/* Card 4: Toggle */}
                 <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
                     <span className="font-bold text-gray-800">เมนูเข้าร่วมการสะสมแต้ม</span>
                     <div className="w-12 h-6 bg-green-500 rounded-full p-1 flex justify-end cursor-pointer"><div className="w-4 h-4 bg-white rounded-full shadow-sm"></div></div>
                 </div>
             </div>
        </div>
    );
};

const LineOAConnectView = () => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#F9FAFB]">
             <header className="mb-8 flex items-center gap-3">
                 <div className="p-3 bg-[#06C755] rounded-xl text-white"><MessageCircle size={28} /></div>
                 <h1 className={`${FONTS.header} text-3xl font-bold text-gray-800`}>เชื่อมต่อ Line OA</h1>
             </header>

             <div className="max-w-3xl mx-auto">
                 <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                     <div className="bg-[#06C755] p-6 text-white flex justify-between items-center">
                         <div>
                             <h3 className="text-xl font-bold">Line Official Account</h3>
                             <p className="text-white/80 text-sm">เชื่อมต่อเพื่อซิงค์ข้อมูลสมาชิกและส่งข้อความ</p>
                         </div>
                         <div className="bg-white/20 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                             <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div> Disconnected
                         </div>
                     </div>
                     
                     <div className="p-8 space-y-6">
                         <div className="space-y-4">
                             <div>
                                 <label className="block text-sm font-bold text-gray-700 mb-2">Channel ID</label>
                                 <div className="relative">
                                     <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                     <input type="text" placeholder="กรอก Channel ID จาก Line Developers" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-100 focus:border-green-400 outline-none transition" />
                                 </div>
                             </div>
                             <div>
                                 <label className="block text-sm font-bold text-gray-700 mb-2">Channel Secret</label>
                                 <div className="relative">
                                     <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                     <input type="password" placeholder="กรอก Channel Secret" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-100 focus:border-green-400 outline-none transition" />
                                 </div>
                             </div>
                         </div>

                         <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                             <div>
                                 <p className="text-xs text-gray-500 font-bold uppercase mb-1">Webhook URL</p>
                                 <p className="text-sm font-mono text-gray-700 truncate max-w-md">https://api.petomni.com/webhook/line/v1/callback</p>
                             </div>
                             <button className="p-2 hover:bg-white rounded-lg transition text-gray-500 hover:text-gray-800 border border-transparent hover:border-gray-200"><Copy size={18} /></button>
                         </div>

                         <button className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-lg shadow-lg transition transform active:scale-[0.99]">
                             บันทึกและเชื่อมต่อ
                         </button>
                     </div>
                 </div>
                 
                 <div className="mt-8 text-center">
                     <p className="text-gray-400 text-sm">ต้องการความช่วยเหลือ? <a href="#" className="text-green-600 font-bold hover:underline">ดูคู่มือการตั้งค่า</a></p>
                 </div>
             </div>
        </div>
    );
};

const MemberDetailView = ({ member, onBack }) => {
    // Local state for right panel & member data editing
    const [localMember, setLocalMember] = useState(member);
    const [editingSection, setEditingSection] = useState(null); 
    const [activePetId, setActivePetId] = useState(member.petIds?.[0] || null);
    const [panelMode, setPanelMode] = useState(member.petIds?.[0] ? 'detail' : null); 
    const [petStatCounts, setPetStatCounts] = useState({});
    
    // Address Edit Form State
    const [addressForm, setAddressForm] = useState({ postcode: '', province: '', district: '', subDistrict: '', details: '' });
    const [postcodeSuggestions, setPostcodeSuggestions] = useState([]);
    const [showPostcodeSuggestions, setShowPostcodeSuggestions] = useState(false);

    const memberPets = PetsDB.filter(p => member.petIds.includes(p.id));
    const activePet = memberPets.find(p => p.id === activePetId) || null;
    const billHistory = SALES_HISTORY_DB.filter(b => b.member === member.name);

    useEffect(() => {
        const initialCounts = {
            dog: 0, cat: 0, rabbit: 0, rodent: 0, reptile: 0, bird: 0, fish: 0,
            ...(localMember.pets ? localMember.pets.reduce((acc, type) => { acc[type] = (acc[type] || 0) + 1; return acc; }, {}) : {})
        };
        setPetStatCounts(initialCounts);
    }, [localMember]);

    useEffect(() => { if (activePetId) setPanelMode('detail'); }, [activePetId]);

    useEffect(() => {
        if (editingSection === 'address') {
            setAddressForm({ postcode: '', province: '', district: '', subDistrict: '', details: localMember.address || '' });
        }
    }, [editingSection, localMember.address]);

    const handleAddPet = () => { setActivePetId(null); setPanelMode('add'); };
    const handleEditPet = () => { setPanelMode('edit'); };
    const handleSaveSection = (section) => {
        if (section === 'address') {
            const { details, subDistrict, district, province, postcode } = addressForm;
            const fullAddress = `${details} ${subDistrict ? 'แขวง' + subDistrict : ''} ${district ? 'เขต' + district : ''} ${province ? 'จังหวัด' + province : ''} ${postcode}`.trim().replace(/\s+/g, ' ');
            setLocalMember({...localMember, address: fullAddress});
        }
        setEditingSection(null);
    };

    const handleStatChange = (type, delta) => { setPetStatCounts(prev => ({ ...prev, [type]: Math.max(0, (prev[type] || 0) + delta) })); };

    // Address Helpers
    const handlePostcodeChange = (e) => {
        const value = e.target.value;
        setAddressForm(prev => ({ ...prev, postcode: value }));
        if (value.length > 1) {
            const uniqueSuggestions = [];
            const seen = new Set();
            THAI_ADDRESS_MOCK.filter(item => item.postcode.startsWith(value)).forEach(item => {
                const key = `${item.postcode}-${item.district}`;
                if (!seen.has(key)) { seen.add(key); uniqueSuggestions.push(item); }
            });
            setPostcodeSuggestions(uniqueSuggestions);
            setShowPostcodeSuggestions(true);
        } else {
            setPostcodeSuggestions([]);
            setShowPostcodeSuggestions(false);
        }
    };

    const selectPostcode = (item) => {
        setAddressForm(prev => ({ ...prev, postcode: item.postcode, province: item.province, district: item.district, subDistrict: '' }));
        setShowPostcodeSuggestions(false);
    };

    const getFilteredProvinces = () => {
         let matched = THAI_ADDRESS_MOCK;
         if (addressForm.postcode.length === 5) matched = matched.filter(a => a.postcode === addressForm.postcode);
         return [...new Set(matched.map(a => a.province))];
    };

    const getFilteredDistricts = () => {
         let matched = THAI_ADDRESS_MOCK;
         if (addressForm.postcode.length === 5) matched = matched.filter(a => a.postcode === addressForm.postcode);
         if (addressForm.province) matched = matched.filter(a => a.province === addressForm.province);
         return [...new Set(matched.map(a => a.district))];
    };

    const getFilteredSubDistricts = () => {
         let matched = THAI_ADDRESS_MOCK;
         if (addressForm.postcode.length === 5) matched = matched.filter(a => a.postcode === addressForm.postcode);
         if (addressForm.province) matched = matched.filter(a => a.province === addressForm.province);
         if (addressForm.district) matched = matched.filter(a => a.district === addressForm.district);
         return [...new Set(matched.flatMap(a => a.subDistrict))];
    };

    const handleSubDistrictChange = (sub) => {
        const matched = THAI_ADDRESS_MOCK.find(a => a.province === addressForm.province && a.district === addressForm.district && a.subDistrict.includes(sub));
        if (matched) setAddressForm(prev => ({ ...prev, subDistrict: sub, postcode: matched.postcode }));
        else setAddressForm(prev => ({ ...prev, subDistrict: sub }));
    };

    const PET_TYPE_CONFIG = [
        { id: 'dog', label: 'สุนัข', icon: '🐶' }, { id: 'cat', label: 'แมว', icon: '🐱' }, { id: 'rabbit', label: 'กระต่าย', icon: '🐰' },
        { id: 'rodent', label: 'สัตว์ฟันแทะ', icon: '🐹' }, { id: 'reptile', label: 'สัตว์เลื้อยคลาน', icon: '🦎' }, { id: 'bird', label: 'นก', icon: '🦜' }, { id: 'fish', label: 'ปลา', icon: '🐟' },
    ];

    return (
        <div className="flex-1 flex flex-col min-w-0 bg-[#F9FAFB] h-full overflow-hidden">
            <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-4"><button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition"><ArrowLeft size={20} /></button><h1 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ข้อมูลสมาชิก</h1></div>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                <div className="max-w-5xl mx-auto space-y-6">
                    {/* Zone 1: Profile Header */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex justify-between items-start group relative">
                        <div className="flex gap-6 w-full">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl text-white font-bold shadow-lg ${localMember.theme === 'amber' ? 'bg-amber-400' : localMember.theme === 'purple' ? 'bg-purple-500' : localMember.theme === 'blue' ? 'bg-blue-500' : localMember.theme === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'}`}>{localMember.name.split(' ')[1]?.charAt(0) || 'A'}</div>
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    {editingSection === 'profile' ? (
                                        <div className="flex items-center gap-2 w-full max-w-md"><input type="text" className="flex-1 border border-gray-300 rounded-lg px-3 py-1 text-lg font-bold text-gray-900 focus:ring-2 focus:ring-blue-200 outline-none" value={localMember.name} onChange={e => setLocalMember({...localMember, name: e.target.value})}/><button onClick={() => handleSaveSection('profile')} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"><Save size={18}/></button><button onClick={() => setEditingSection(null)} className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200"><X size={18}/></button></div>
                                    ) : (
                                        <><h2 className={`${FONTS.header} text-2xl font-bold text-gray-900`}>{localMember.name}</h2><button onClick={() => setEditingSection('profile')} className="text-gray-300 hover:text-gray-500 transition p-1 rounded-full hover:bg-gray-50"><Edit2 size={16} /></button></>
                                    )}
                                </div>
                                <p className="text-gray-500 text-sm mb-3 font-mono">ID: {localMember.id}</p>
                                <span className={`${FONTS.header} px-3 py-1 rounded-full text-xs font-bold ${localMember.levelColor}`}>{localMember.level}</span>
                            </div>
                        </div>
                        <div className="text-right"><p className="text-sm text-gray-400 mb-1">คะแนนสะสม</p><p className={`${FONTS.header} text-3xl font-bold text-[#F59E0B]`}>{localMember.points.toLocaleString()}</p></div>
                    </div>

                    {/* Zone 2: Personal Info & Address */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
                            <div className="flex justify-between items-center mb-4"><h3 className={`${FONTS.header} font-bold text-gray-800 flex items-center gap-2`}><User size={18} className="text-gray-400"/> ข้อมูลส่วนตัว</h3>{editingSection === 'personal' ? (<div className="flex gap-2"><button onClick={() => handleSaveSection('personal')} className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-lg"><Save size={16} /></button><button onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-lg"><X size={16} /></button></div>) : (<button onClick={() => setEditingSection('personal')} className="text-gray-400 hover:text-gray-600 transition"><Edit2 size={16} /></button>)}</div>
                            <div className="space-y-3">
                                {editingSection === 'personal' ? (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-2 text-sm items-center"><span className="text-gray-400">ชื่อเล่น</span><input type="text" className="col-span-2 border border-gray-200 rounded px-2 py-1" value={localMember.nickname} onChange={e => setLocalMember({...localMember, nickname: e.target.value})} /></div>
                                        <div className="grid grid-cols-3 gap-2 text-sm items-center"><span className="text-gray-400">วันเกิด</span><input type="text" className="col-span-2 border border-gray-200 rounded px-2 py-1" value={localMember.dob} onChange={e => setLocalMember({...localMember, dob: e.target.value})} /></div>
                                        <div className="grid grid-cols-3 gap-2 text-sm items-center"><span className="text-gray-400">เบอร์โทร</span><input type="text" className="col-span-2 border border-gray-200 rounded px-2 py-1" value={localMember.phone} onChange={e => setLocalMember({...localMember, phone: e.target.value})} /></div>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="grid grid-cols-3 gap-2 text-sm"><span className="text-gray-400">ชื่อเล่น</span><span className="col-span-2 font-medium text-gray-700">{localMember.nickname || '-'}</span></div>
                                        <div className="grid grid-cols-3 gap-2 text-sm"><span className="text-gray-400">วันเกิด</span><span className="col-span-2 font-medium text-gray-700">{localMember.dob || '-'}</span></div>
                                        <div className="grid grid-cols-3 gap-2 text-sm"><span className="text-gray-400">เบอร์โทร</span><span className="col-span-2 font-medium text-gray-700">{localMember.phone}</span></div>
                                        <div className="grid grid-cols-3 gap-2 text-sm items-center"><span className="text-gray-400">Line ID</span>{localMember.line ? (<button className="col-span-2 flex items-center gap-2 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-lg hover:bg-green-100 transition w-fit border border-green-200 shadow-sm"><MessageCircle size={16} fill="currentColor" /> ติดต่อผ่านไลน์</button>) : (<span className="col-span-2 font-medium text-gray-400">-</span>)}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
                            <div className="flex justify-between items-center mb-4"><h3 className={`${FONTS.header} font-bold text-gray-800 flex items-center gap-2`}><MapPin size={18} className="text-gray-400"/> ที่อยู่</h3>{editingSection === 'address' ? (<div className="flex gap-2"><button onClick={() => handleSaveSection('address')} className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-lg"><Save size={16} /></button><button onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-lg"><X size={16} /></button></div>) : (<button onClick={() => setEditingSection('address')} className="text-gray-400 hover:text-gray-600 transition"><Edit2 size={16} /></button>)}</div>
                            <div className="space-y-4">
                                {editingSection === 'address' ? (
                                    <div className="space-y-3">
                                        <div className="relative"><label className="text-xs text-gray-400 mb-1 block">รหัสไปรษณีย์</label><input type="text" className="w-full border border-gray-200 rounded-lg p-2 text-sm" value={addressForm.postcode} onChange={handlePostcodeChange} maxLength={5} placeholder="กรอกรหัสไปรษณีย์" />{showPostcodeSuggestions && postcodeSuggestions.length > 0 && (<ul className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-40 overflow-y-auto">{postcodeSuggestions.map((item, idx) => (<li key={idx} onClick={() => selectPostcode(item)} className="p-2 text-xs hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0"><span className="font-bold text-blue-600">{item.postcode}</span> - {item.district} - {item.province}</li>))}</ul>)}</div>
                                        <div className="grid grid-cols-2 gap-2"><div><label className="text-xs text-gray-400 mb-1 block">จังหวัด</label><select className="w-full border border-gray-200 rounded-lg p-2 text-sm" value={addressForm.province} onChange={e => setAddressForm({...addressForm, province: e.target.value, district: '', subDistrict: ''})}><option value="">เลือกจังหวัด</option>{getFilteredProvinces().map(p => <option key={p} value={p}>{p}</option>)}</select></div><div><label className="text-xs text-gray-400 mb-1 block">เขต/อำเภอ</label><select className="w-full border border-gray-200 rounded-lg p-2 text-sm" value={addressForm.district} onChange={e => setAddressForm({...addressForm, district: e.target.value, subDistrict: ''})} disabled={!addressForm.province}><option value="">เลือกเขต/อำเภอ</option>{getFilteredDistricts().map(d => <option key={d} value={d}>{d}</option>)}</select></div></div>
                                        <div><label className="text-xs text-gray-400 mb-1 block">แขวง/ตำบล</label><select className="w-full border border-gray-200 rounded-lg p-2 text-sm" value={addressForm.subDistrict} onChange={e => handleSubDistrictChange(e.target.value)} disabled={!addressForm.district}><option value="">เลือกแขวง/ตำบล</option>{getFilteredSubDistricts().map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                                        <div><label className="text-xs text-gray-400 mb-1 block">รายละเอียดที่อยู่</label><textarea className="w-full border border-gray-200 rounded-lg p-2 text-sm" rows="2" value={addressForm.details} onChange={e => setAddressForm({...addressForm, details: e.target.value})} placeholder="บ้านเลขที่, ถนน, ซอย..." /></div>
                                    </div>
                                ) : (
                                    <div><p className="text-xs text-gray-400 mb-1">ที่อยู่ติดต่อ / จัดส่ง</p><p className="text-sm text-gray-700 font-medium leading-relaxed">{localMember.address || '-'}</p></div>
                                )}
                                {editingSection !== 'address' && (<div className="h-24 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200"><p className="text-xs text-gray-400 flex items-center gap-1"><MapIcon size={14}/> แผนที่ (Mockup)</p></div>)}
                            </div>
                        </div>
                    </div>

                    {/* Zone 3: Pet Stats */}
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative">
                        <div className="flex justify-between items-center mb-4"><h3 className={`${FONTS.header} font-bold text-gray-800 flex items-center gap-2`}><PawPrint size={18} className="text-gray-400"/> จำนวนสัตว์เลี้ยง (ทั้งหมด)</h3>{editingSection === 'stats' ? (<div className="flex gap-2"><button onClick={() => handleSaveSection('stats')} className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-lg"><Save size={16} /></button><button onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-lg"><X size={16} /></button></div>) : (<button onClick={() => setEditingSection('stats')} className="text-gray-400 hover:text-gray-600 transition"><Edit2 size={16} /></button>)}</div>
                        {editingSection === 'stats' ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in zoom-in duration-200">{PET_TYPE_CONFIG.map(type => (<div key={type.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3 flex flex-col items-center gap-2"><div className="flex items-center gap-2"><span className="text-xl">{type.icon}</span><span className="text-xs font-bold text-gray-600">{type.label}</span></div><div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-200"><button onClick={() => handleStatChange(type.id, -1)} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-l-lg"><Minus size={14}/></button><input type="number" className="w-12 text-center text-sm font-bold text-gray-800 outline-none" value={petStatCounts[type.id] || 0} onChange={(e) => { const val = parseInt(e.target.value) || 0; setPetStatCounts({...petStatCounts, [type.id]: val}); }}/><button onClick={() => handleStatChange(type.id, 1)} className="p-2 text-green-500 hover:text-green-700 hover:bg-green-50 rounded-r-lg"><Plus size={14}/></button></div></div>))}</div>
                        ) : (
                            <div className="flex gap-4 flex-wrap">{Object.keys(petStatCounts).length > 0 && Object.values(petStatCounts).some(v => v > 0) ? Object.entries(petStatCounts).filter(([_, count]) => count > 0).map(([typeId, count]) => { const typeConfig = PET_TYPE_CONFIG.find(t => t.id === typeId) || { icon: '🐾', label: typeId }; return (<div key={typeId} className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 min-w-[120px]"><div className="text-2xl">{typeConfig.icon}</div><div><p className="text-xs text-gray-400 uppercase font-bold">{typeConfig.label}</p><p className="text-lg font-bold text-gray-800">{count} ตัว</p></div></div>); }) : (<p className="text-sm text-gray-400">ยังไม่มีข้อมูลจำนวนสัตว์เลี้ยง</p>)}</div>
                        )}
                    </div>

                    {/* Zone 4: History */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="flex border-b border-gray-100"><button className="px-6 py-4 text-sm font-bold text-gray-800 border-b-2 border-gray-800">ประวัติการซื้อ (บิล)</button><button className="px-6 py-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition">ประวัติสินค้า</button></div>
                        <div className="p-0">{billHistory.length > 0 ? (<table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="p-4 pl-6">เลขที่บิล</th><th className="p-4">วันที่</th><th className="p-4 text-center">รายการ</th><th className="p-4 text-right">ยอดรวม</th><th className="p-4 text-center">สถานะ</th></tr></thead><tbody className="divide-y divide-gray-50">{billHistory.map(bill => (<tr key={bill.id} className="hover:bg-gray-50"><td className="p-4 pl-6 font-mono text-blue-600">{bill.id}</td><td className="p-4 text-gray-600">{bill.date}</td><td className="p-4 text-center">{bill.items}</td><td className="p-4 text-right font-bold">{bill.total.toLocaleString()}</td><td className="p-4 text-center"><span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{bill.status}</span></td></tr>))}</tbody></table>) : (<div className="p-8 text-center text-gray-400">ไม่พบประวัติการซื้อ</div>)}</div>
                    </div>

                    {/* Zone 5: Pet Management */}
                    <div className="grid grid-cols-12 gap-6 min-h-[500px]">
                        <div className="col-span-4 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"><h3 className={`${FONTS.header} font-bold text-gray-800`}>สัตว์เลี้ยง</h3><button onClick={handleAddPet} className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white hover:scale-105 transition"><Plus size={16}/></button></div>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                                {memberPets.map(pet => {
                                    const hasAppointment = false; // Mock for now
                                    const hasDisease = pet.chronicDiseases && pet.chronicDiseases.length > 0;
                                    return (
                                        <div key={pet.id} onClick={() => { setActivePetId(pet.id); setPanelMode('detail'); }} className={`p-3 rounded-xl cursor-pointer transition flex items-center gap-3 border relative ${activePetId === pet.id && panelMode === 'detail' ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-gray-50 hover:border-gray-200'}`}>
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-white border ${activePetId === pet.id ? 'border-blue-100' : 'border-gray-100'}`}>{pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐾'}</div>
                                            <div className="flex-1 min-w-0"><h4 className={`font-bold text-sm truncate ${activePetId === pet.id && panelMode === 'detail' ? 'text-blue-700' : 'text-gray-700'}`}>{pet.name}</h4><p className="text-xs text-gray-500 truncate">{pet.breed}</p></div>
                                            <div className="absolute top-2 right-2 flex gap-1">{hasAppointment && <Clock3 size={14} className="text-purple-500 fill-purple-100" />}{hasDisease && <AlertCircle size={14} className="text-red-500 fill-red-50" />}</div>
                                        </div>
                                    );
                                })}
                                {memberPets.length === 0 && <div className="text-center text-gray-400 py-8 text-sm">ยังไม่มีสัตว์เลี้ยงที่ลงทะเบียน</div>}
                            </div>
                        </div>

                        <div className="col-span-8 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col">
                            {panelMode === 'detail' && activePet ? (
                                <>
                                    <div className="flex justify-between items-start mb-8"><div className="flex gap-6 items-center"><div className="w-24 h-24 rounded-full bg-gray-50 border-4 border-white shadow-md flex items-center justify-center text-5xl relative">{activePet.type === 'dog' ? '🐶' : activePet.type === 'cat' ? '🐱' : '🐾'}</div><div><h2 className={`${FONTS.header} text-3xl font-bold text-gray-800 mb-1`}>{activePet.name}</h2><div className="flex items-center gap-3 text-sm text-gray-500"><span className="px-3 py-1 bg-gray-100 rounded-full font-bold">{activePet.breed}</span><span>{activePet.gender === 'Male' ? '♂ ชาย' : '♀ หญิง'}</span></div></div></div><button onClick={handleEditPet} className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition px-3 py-2 rounded-lg hover:bg-gray-50"><Edit2 size={16} /> <span className="text-sm font-bold">แก้ไข</span></button></div>
                                    <div className="grid grid-cols-2 gap-8 mb-8">
                                        <div className="space-y-1"><p className="text-xs text-gray-400 font-bold uppercase">วันเกิด / อายุ</p><p className="text-lg font-medium text-gray-700">{activePet.birthYear} ({new Date().getFullYear() - activePet.birthYear} ปี)</p></div>
                                        <div className="space-y-1"><p className="text-xs text-gray-400 font-bold uppercase">น้ำหนักล่าสุด</p><p className="text-lg font-medium text-gray-700">{activePet.weight} กก.</p></div>
                                        <div className="space-y-1"><p className="text-xs text-gray-400 font-bold uppercase">ลักษณะขน</p><p className="text-lg font-medium text-gray-700">{activePet.coatType || '-'}</p></div>
                                        <div className="space-y-1 col-span-2"><p className="text-xs text-gray-400 font-bold uppercase mb-2">โรคประจำตัว / ข้อควรระวัง</p><div className="flex flex-wrap gap-2">{activePet.chronicDiseases.length > 0 ? (activePet.chronicDiseases.map((d, i) => (<span key={i} className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-sm font-bold flex items-center gap-2"><Activity size={14} /> {d}</span>))) : (<span className="text-gray-400 text-sm">- ปลอดภัย แข็งแรง -</span>)}</div></div>
                                    </div>
                                    <div className="mt-auto pt-6 border-t border-gray-100 grid grid-cols-2 gap-3"><button className="py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition flex items-center justify-center gap-2"><History size={18}/> ประวัติการรักษา</button><button onClick={() => setPanelMode('history_grooming')} className="py-3 bg-orange-50 text-orange-600 rounded-xl font-bold hover:bg-orange-100 transition flex items-center justify-center gap-2"><Scissors size={18}/> ประวัติอาบน้ำตัดขน</button></div>
                                </>
                            ) : panelMode === 'add' || panelMode === 'edit' ? (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4"><h3 className={`${FONTS.header} text-xl font-bold text-gray-800`}>{panelMode === 'add' ? 'เพิ่มสัตว์เลี้ยงใหม่' : 'แก้ไขข้อมูลสัตว์เลี้ยง'}</h3><button onClick={() => { setActivePetId(member.petIds[0] || null); setPanelMode(member.petIds[0] ? 'detail' : null); }} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
                                        <div className="flex justify-center mb-4"><div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 cursor-pointer transition"><ImageIcon size={24} /><span className="text-xs mt-1">เพิ่มรูป</span></div></div>
                                        <div className="grid grid-cols-2 gap-4"><div><label className="text-sm text-gray-500 block mb-1">ชื่อน้อง</label><input type="text" className="w-full border border-gray-200 rounded-lg p-2" defaultValue={panelMode === 'edit' ? activePet?.name : ''} /></div><div><label className="text-sm text-gray-500 block mb-1">สายพันธุ์</label><input type="text" className="w-full border border-gray-200 rounded-lg p-2" defaultValue={panelMode === 'edit' ? activePet?.breed : ''} /></div><div><label className="text-sm text-gray-500 block mb-1">ปีเกิด</label><input type="number" className="w-full border border-gray-200 rounded-lg p-2" defaultValue={panelMode === 'edit' ? activePet?.birthYear : ''} /></div><div><label className="text-sm text-gray-500 block mb-1">น้ำหนัก (กก.)</label><input type="number" className="w-full border border-gray-200 rounded-lg p-2" defaultValue={panelMode === 'edit' ? activePet?.weight : ''} /></div><div className="col-span-2"><label className="text-sm text-gray-500 block mb-1">ลักษณะขน</label><select className="w-full border border-gray-200 rounded-lg p-2 bg-white" defaultValue={panelMode === 'edit' ? activePet?.coatType : 'ขนสั้น'}><option value="ขนสั้น">ขนสั้น</option><option value="ขนสั้น 2 ชั้น">ขนสั้น 2 ชั้น</option><option value="ขนยาว">ขนยาว</option><option value="ขนยาว 2 ชั้น">ขนยาว 2 ชั้น</option></select></div></div>
                                    </div>
                                    <div className="pt-4 border-t border-gray-100 flex gap-3"><button onClick={() => { setActivePetId(member.petIds[0] || null); setPanelMode(member.petIds[0] ? 'detail' : null); }} className="flex-1 py-2 border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50">ยกเลิก</button><button className="flex-1 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-100">บันทึก</button></div>
                                </div>
                            ) : panelMode === 'history_grooming' ? (
                                <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                                    <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4"><h3 className={`${FONTS.header} text-xl font-bold text-gray-800 flex items-center gap-2`}><Scissors size={20} className="text-orange-500"/> ประวัติอาบน้ำตัดขน</h3><button onClick={() => setPanelMode('detail')} className="text-gray-400 hover:text-gray-600"><X size={20}/></button></div>
                                    <div className="flex-1 overflow-y-auto custom-scrollbar"><table className="w-full text-left text-sm"><thead className="bg-gray-50 text-gray-500"><tr><th className="p-3 pl-4">วันที่</th><th className="p-3">รายการ</th><th className="p-3">สาขา</th><th className="p-3 text-right">ราคา</th></tr></thead><tbody className="divide-y divide-gray-100">{MOCK_GROOMING_HISTORY.map((h) => (<tr key={h.id} className="hover:bg-gray-50"><td className="p-3 pl-4 text-gray-600">{h.date}</td><td className="p-3 font-bold text-gray-700">{h.service}{h.note && h.note !== '-' && <div className="text-xs text-gray-400 font-normal mt-0.5">Note: {h.note}</div>}</td><td className="p-3 text-gray-500">{h.branch}</td><td className="p-3 text-right font-bold text-emerald-600">{h.amount}</td></tr>))}</tbody></table></div>
                                    <div className="pt-4 border-t border-gray-100"><button onClick={() => setPanelMode('detail')} className="w-full py-2 border border-gray-200 rounded-lg text-gray-600 font-bold hover:bg-gray-50">กลับหน้ารายละเอียด</button></div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-300"><PawPrint size={64} className="mb-4 opacity-20"/><p>เลือกสัตว์เลี้ยงเพื่อดูรายละเอียด</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CRMModule = ({ filteredMembers, crmSearchTerm, setCrmSearchTerm, crmFilterPet, togglePetFilter, crmFilterLevel, setCrmFilterLevel, isLevelDropdownOpen, setIsLevelDropdownOpen, handleNavigate, setIsDrawerOpen, setIsNewMemberOpen, membersDB }) => {
    const dropdownRef = useRef(null);
    const [activeTab, setActiveTab] = useState('members'); 
    const [petFilter, setPetFilter] = useState({ search: '', type: 'all', age: 'all', weight: 'all', disease: 'all' });
    const [viewMember, setViewMember] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsLevelDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => { document.removeEventListener("mousedown", handleClickOutside); };
    }, [dropdownRef, setIsLevelDropdownOpen]);

    const filteredPets = useMemo(() => {
        return PetsDB.filter(pet => {
            const matchesSearch = pet.name.includes(petFilter.search) || pet.ownerName.includes(petFilter.search) || pet.phone.includes(petFilter.search);
            const matchesType = petFilter.type === 'all' || pet.type === petFilter.type;
            return matchesSearch && matchesType;
        });
    }, [petFilter]);

    if (viewMember) return <MemberDetailView member={viewMember} onBack={() => setViewMember(null)} />;

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
             <CRMSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={handleNavigate} activeTab={activeTab} onTabChange={setActiveTab} />
            {activeTab === 'settings' ? (<CRMSettingsView />) : activeTab === 'line_oa' ? (<LineOAConnectView />) : (
                <div className="flex-1 flex flex-col min-w-0">
                    <header className="h-20 bg-white border-b border-gray-100 px-8 flex items-center justify-center shrink-0 relative"><h1 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>{activeTab === 'members' ? 'รายชื่อสมาชิก' : 'รายชื่อสัตว์เลี้ยงสมาชิก'}</h1></header>
                    
                    {activeTab === 'members' ? (
                        <div className="flex-1 p-8 overflow-hidden flex flex-col">
                            <div className="flex justify-between items-center mb-6 gap-4">
                                <div className="flex-1 relative max-w-lg"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="ค้นหา ชื่อ, เบอร์โทร, ที่อยู่" value={crmSearchTerm} onChange={(e) => setCrmSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition text-gray-700`} /></div>
                                <div className="flex items-center gap-3"><div className="flex gap-2 mr-4">{PET_FILTER_BUTTONS.map(pet => (<button key={pet.type} onClick={() => togglePetFilter(pet.type)} className={`w-10 h-10 rounded-full border flex items-center justify-center text-2xl transition-all ${crmFilterPet === pet.type ? 'bg-yellow-100 border-yellow-400 shadow-md scale-110' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>{pet.icon}</button>))}</div>
                                    <div className="relative" ref={dropdownRef}><button onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)} className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 font-bold hover:bg-gray-50 min-w-[160px] justify-between"><span>{crmFilterLevel === 'ทั้งหมด' ? 'ระดับสมาชิก' : crmFilterLevel}</span><ChevronDown size={16} className={`transition-transform ${isLevelDropdownOpen ? 'rotate-180' : ''}`}/></button>{isLevelDropdownOpen && (<div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200">{MEMBER_LEVEL_OPTIONS.map(option => (<button key={option} onClick={() => { setCrmFilterLevel(option); setIsLevelDropdownOpen(false); }} className={`w-full text-left px-4 py-2 hover:bg-gray-50 text-sm font-medium ${crmFilterLevel === option ? 'text-yellow-600 bg-yellow-50' : 'text-gray-700'}`}>{option}</button>))}</div>)}</div>
                                    <button onClick={() => setIsNewMemberOpen(true)} className={`${FONTS.header} px-6 py-3 bg-[#FCD34D] hover:bg-[#F59E0B] text-gray-900 font-bold rounded-xl shadow-lg shadow-yellow-100 transition flex items-center gap-2`}><Plus size={20} /> เพิ่มสมาชิก</button>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                <div className="overflow-y-auto flex-1 custom-scrollbar"><table className="w-full text-left border-collapse"><thead className="bg-gray-50 sticky top-0 z-10"><tr><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>รหัสสมาชิก</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>ชื่อสมาชิก</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>เลี้ยง</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>ระดับสมาชิก</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>คะแนน</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>Line</th></tr></thead><tbody className="divide-y divide-gray-50">{filteredMembers.length > 0 ? (filteredMembers.map((member) => (<tr key={member.id} onClick={() => setViewMember(member)} className="hover:bg-gray-50 transition group cursor-pointer"><td className={`${FONTS.body} p-6 text-gray-600 font-medium`}>{member.id}</td><td className="p-6"><div className="flex items-center gap-3"><div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${member.theme === 'amber' ? 'bg-amber-400' : member.theme === 'purple' ? 'bg-purple-500' : member.theme === 'blue' ? 'bg-blue-500' : member.theme === 'pink' ? 'bg-pink-500' : 'bg-indigo-500'}`}>{member.name.split(' ')[1]?.charAt(0) || 'A'}</div><span className={`${FONTS.header} font-bold text-gray-800`}>{member.name}</span></div></td><td className="p-6 text-center"><div className="flex justify-center -space-x-2">{member.pets.map((p, i) => (<div key={i} className="w-8 h-8 rounded-full bg-orange-50 border-2 border-white flex items-center justify-center text-sm shadow-sm z-0 relative">{p === 'dog' ? '🐶' : p === 'cat' ? '🐱' : p === 'rabbit' ? '🐰' : p === 'fish' ? '🐟' : '🦜'}</div>))}</div></td><td className="p-6 text-center"><span className={`${FONTS.header} px-4 py-1.5 rounded-full text-xs font-bold ${member.levelColor}`}>{member.level}</span></td><td className={`${FONTS.header} p-6 text-center font-bold text-gray-800`}>{member.points.toLocaleString()}</td><td className="p-6 text-center"><div className="flex justify-center">{member.line ? (<div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-md shadow-green-200"><MessageCircle size={16} fill="white" /></div>) : (<div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-400"><Minus size={16} /></div>)}</div></td></tr>))) : (<tr><td colSpan="6" className="p-12 text-center text-gray-400"><div className="flex flex-col items-center justify-center"><Search size={48} className="mb-4 opacity-20" /><p className={`${FONTS.header} text-lg font-medium`}>ไม่พบข้อมูลสมาชิก</p></div></td></tr>)}</tbody></table></div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 p-8 overflow-hidden flex flex-col">
                            <div className="flex flex-wrap justify-between items-center mb-6 gap-4" ref={dropdownRef}><div className="flex-1 relative min-w-[300px]"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" placeholder="ชื่อน้อง, เจ้าของ, เบอร์โทร, โรคประจำตัว" value={petFilter.search} onChange={(e) => setPetFilter({...petFilter, search: e.target.value})} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition text-gray-700`} /></div><div className="flex items-center gap-2 flex-wrap"><div className="flex gap-2 mr-2">{PET_FILTER_BUTTONS.map(pet => (<button key={pet.type} onClick={() => setPetFilter({...petFilter, type: petFilter.type === pet.type ? 'all' : pet.type})} className={`w-10 h-10 rounded-full border flex items-center justify-center text-2xl transition-all ${petFilter.type === pet.type ? 'bg-yellow-100 border-yellow-400 shadow-md scale-110' : 'bg-white border-gray-200 hover:bg-gray-50'}`}>{pet.icon}</button>))}</div></div></div>
                            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col">
                                <div className="overflow-y-auto flex-1 custom-scrollbar"><table className="w-full text-left border-collapse"><thead className="bg-gray-50 sticky top-0 z-10"><tr><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>รูปน้อง</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>ชื่อน้อง</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>เจ้าของ (ติดต่อ)</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>เพศ</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm`}>โรคประจำตัว</th><th className={`${FONTS.header} p-6 text-gray-500 font-bold text-sm text-center`}>ติดต่อ</th></tr></thead><tbody className="divide-y divide-gray-50">{filteredPets.length > 0 ? (filteredPets.map((pet) => (<tr key={pet.id} className="hover:bg-gray-50 transition group cursor-pointer" onClick={() => { const owner = membersDB.find(m => m.phone === pet.phone || m.name === pet.ownerName); if (owner) setViewMember(owner); }}><td className="p-6"><div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${pet.type === 'dog' ? 'bg-orange-100 text-orange-600' : pet.type === 'cat' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100'}`}>{pet.type === 'dog' ? '🐶' : pet.type === 'cat' ? '🐱' : '🐾'}</div></td><td className="p-6"><div><h4 className={`${FONTS.header} font-bold text-gray-800 text-lg`}>{pet.name}</h4><p className={`${FONTS.body} text-xs text-gray-500`}>{pet.breed} • {pet.weight} กก.</p></div></td><td className="p-6"><div><p className={`${FONTS.header} font-bold text-gray-800`}>{pet.ownerName}</p><p className={`${FONTS.body} text-xs text-gray-500 flex items-center gap-1`}><Smartphone size={10} /> {pet.phone}</p></div></td><td className="p-6 text-center">{pet.gender === 'Male' ? <span className="text-blue-500">♂</span> : <span className="text-pink-500">♀</span>}</td><td className="p-6"><div className="flex flex-wrap gap-1">{pet.chronicDiseases.length > 0 ? (pet.chronicDiseases.map((d, i) => (<span key={i} className={`px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${d.includes('ทำหมัน') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{d}</span>))) : (<span className="text-gray-300 text-xs">-</span>)}</div></td><td className="p-6 text-center"><button className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-sm mx-auto ${pet.lineId ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}><MessageCircle size={18} fill="currentColor" /></button></td></tr>))) : (<tr><td colSpan="6" className="p-12 text-center text-gray-400"><p>ไม่พบข้อมูลสัตว์เลี้ยง</p></td></tr>)}</tbody></table></div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// ==========================================
// ZONE E (Part 6): GROOMING FEATURES
// ==========================================

// --- 1. BOOKING CALENDAR ---
const BookingCalendar = ({ appointments, setAppointments, onOpenModal }) => {
  const timeSlots = [];
  for(let i=9; i<19; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const getPosition = (time) => {
    if (!time || typeof time !== 'string') return 0; // 🛡️ Guard Clause
    const [h, m] = time.split(':').map(Number);
    if (isNaN(h) || isNaN(m)) return 0;
    return ((h - 9) * 60 + m) * 2;
  };

  const getHeight = (start, end) => {
    return getPosition(end) - getPosition(start);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white h-full relative">
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6 bg-white flex-shrink-0 shadow-sm z-10">
         <div className="flex items-center gap-4">
             <div className="flex items-center bg-gray-100 rounded-lg p-1">
                 <button className="p-1.5 hover:bg-white rounded-md shadow-sm transition-all"><ChevronLeft size={18} className="text-gray-600" /></button>
                 <span className={`${FONTS.header} px-4 font-bold text-gray-700`}>วันนี้, 13 ธ.ค. 2025</span>
                 <button className="p-1.5 hover:bg-white rounded-md shadow-sm transition-all"><ChevronRight size={18} className="text-gray-600" /></button>
             </div>
         </div>
         <button onClick={() => onOpenModal()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-lg shadow-indigo-200">
            <Plus size={16} /> สร้างนัดหมาย
         </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="flex min-w-[800px]">
           {/* Time Column */}
           <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-gray-50/50 pt-10">
              {timeSlots.map(time => (
                  <div key={time} className="h-[60px] text-xs text-gray-400 text-right pr-3 -mt-2.5">
                      {time.endsWith('00') ? time : ''}
                  </div>
              ))}
           </div>

           {/* Groomer Columns */}
           {GROOMERS.map(groomer => (
              <div key={groomer.id} className="flex-1 border-r border-gray-100 min-w-[200px] relative">
                 <div className="h-14 sticky top-0 bg-white border-b border-gray-100 z-10 flex items-center justify-center gap-3 shadow-sm">
                     <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                         <img src={groomer.image} alt={groomer.name} className="w-full h-full object-cover" />
                     </div>
                     <span className={`${FONTS.header} font-bold text-gray-700`}>{groomer.name}</span>
                 </div>

                 <div className="relative h-[1200px] bg-white"> 
                    {timeSlots.map((time, idx) => (
                        <div key={idx} onClick={() => onOpenModal({ groomerId: groomer.id, startTime: time })} className={`h-[60px] border-b ${time.endsWith('30') ? 'border-gray-50 border-dashed' : 'border-gray-100'} hover:bg-indigo-50/30 cursor-pointer transition-colors relative group`}>
                            <div className="hidden group-hover:flex items-center justify-center h-full w-full"><Plus className="text-indigo-300 opacity-50" size={16} /></div>
                        </div>
                    ))}
                    {appointments.filter(app => app.groomerId === groomer.id).map(app => {
                        const customer = CUSTOMERS_MOCK.find(c => c.id === app.customerId);
                        const service = GROOMING_SERVICES_MOCK.find(s => s.id === app.serviceId) || { name: 'Unknown Service' };
                        return (
                            <div key={app.id} onClick={(e) => { e.stopPropagation(); onOpenModal(app); }} className={`absolute left-1 right-1 rounded-lg p-2 border-l-4 cursor-pointer hover:brightness-95 transition-all shadow-sm group overflow-hidden ${groomer.color.replace('text-', 'bg-').replace('border-', '')} bg-opacity-20 border-opacity-100 z-20`} style={{ top: `${getPosition(app.startTime)}px`, height: `${getHeight(app.startTime, app.endTime)}px` }}>
                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-start"><span className={`${FONTS.header} font-bold text-sm text-gray-800 line-clamp-1`}>{customer?.pet?.name || 'ลูกค้าทั่วไป'}</span></div>
                                    <div className="flex items-center gap-1 mt-0.5"><Scissors size={10} className="text-gray-500" /><span className="text-[10px] text-gray-600 line-clamp-1">{service?.name}</span></div>
                                    <div className="mt-auto flex items-center justify-between"><span className="text-[10px] bg-white/60 px-1.5 py-0.5 rounded text-gray-600 font-medium">{app.startTime} - {app.endTime}</span></div>
                                </div>
                            </div>
                        );
                    })}
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

// --- 2. QUICK SETUP MATRIX ---
const QuickSetupModal = ({ isOpen, onClose, onConfirm }) => {
    const [petType, setPetType] = useState('dog'); 
    const [ownerPin, setOwnerPin] = useState('1234');
    const [isPinError, setIsPinError] = useState(false);
    const [prices, setPrices] = useState({});
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => { setFeedback({ type: '', message: '' }); }, [petType, prices, ownerPin]);

    const handlePriceChange = (typeId, weightIndex, value) => {
        setPrices(prev => ({ ...prev, [`${petType}_${typeId}_${weightIndex}`]: value }));
    };

    const handleConfirmSetup = () => {
        if (!ownerPin) { setFeedback({ type: 'error', message: 'กรุณากรอกรหัส PIN' }); return; }
        if (ownerPin !== '1234') { setIsPinError(true); setFeedback({ type: 'error', message: 'รหัส PIN ไม่ถูกต้อง' }); return; }
        setIsPinError(false);
        const generatedServices = [];
        SERVICE_TYPES_MATRIX.forEach(type => {
            WEIGHT_RANGES.forEach((weightLabel, weightIdx) => {
                const price = prices[`${petType}_${type.id}_${weightIdx}`];
                if (price && parseFloat(price) > 0) {
                    const serviceId = `QS_${petType.toUpperCase()}_${type.id.toUpperCase()}_${weightIdx}`;
                    generatedServices.push({
                        id: serviceId, name: `${type.label} (${petType === 'dog' ? 'สุนัข' : 'แมว'}) ${weightLabel}`,
                        duration: 60, price: parseFloat(price), type: petType, category: type.category, isQuickSetup: true
                    });
                }
            });
        });
        if (generatedServices.length === 0) { setFeedback({ type: 'error', message: `กรุณากรอกราคาอย่างน้อย 1 รายการ` }); return; }
        onConfirm(generatedServices);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
             <div className="bg-white w-full max-w-[95vw] rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white rounded-t-2xl z-20">
                    <div><h2 className={`${FONTS.header} text-xl font-bold text-gray-800 flex items-center gap-2`}><Zap className="text-yellow-500 fill-yellow-500" /> Quick Service Setup</h2><p className="text-sm text-gray-500">ตั้งราคาด่วนแบบตาราง (Matrix Pricing)</p></div>
                    <div className="flex bg-gray-100 rounded-lg p-1"><button onClick={()=>setPetType('dog')} className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${petType==='dog' ? 'bg-white shadow text-indigo-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}><Dog size={16}/> สุนัข (Dog)</button><button onClick={()=>setPetType('cat')} className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${petType==='cat' ? 'bg-white shadow text-pink-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}><Cat size={16}/> แมว (Cat)</button></div>
                </div>
                <div className="flex-1 overflow-auto p-0 custom-scrollbar relative bg-white">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-30 shadow-sm"><tr><th className="p-4 border-b border-r border-gray-200 bg-gray-50 text-left min-w-[200px] sticky left-0 z-40 text-gray-600 font-bold">บริการ \ น้ำหนัก</th>{WEIGHT_RANGES.map(w => (<th key={w} className="p-3 border-b border-r border-gray-200 bg-gray-50 text-center text-xs font-bold text-gray-600 min-w-[110px] whitespace-nowrap">{w}</th>))}</tr></thead>
                        <tbody>{SERVICE_TYPES_MATRIX.map((type, idx) => (<tr key={type.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}><td className="p-4 border-b border-r border-gray-200 font-bold text-gray-700 bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{type.label}</td>{WEIGHT_RANGES.map((w, weightIdx) => (<td key={w} className="p-0 border-b border-r border-gray-200 relative group"><div className="absolute inset-0 group-hover:bg-indigo-50 pointer-events-none transition-colors" /><input type="number" placeholder="-" value={prices[`${petType}_${type.id}_${weightIdx}`] || ''} onChange={(e) => handlePriceChange(type.id, weightIdx, e.target.value)} className="w-full h-full p-3 text-center outline-none bg-transparent relative z-10 focus:bg-indigo-50 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-300"/></td>))}</tr>))}</tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4"><div className="relative"><Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${isPinError ? 'text-red-400' : 'text-gray-400'}`} size={16} /><input type="password" inputMode="numeric" value={ownerPin} onChange={(e) => setOwnerPin(e.target.value)} placeholder="Owner PIN" className={`pl-9 pr-4 py-2.5 border rounded-xl outline-none w-48 transition font-mono tracking-widest text-center ${isPinError ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200'}`}/></div>{feedback.message && (<div className={`flex items-center gap-1 text-sm font-bold animate-in slide-in-from-left-2 fade-in ${feedback.type === 'error' ? 'text-red-500' : 'text-green-500'}`}><AlertCircle size={14} /> {feedback.message}</div>)}</div>
                    <div className="flex gap-3"><button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">ยกเลิก</button><button type="button" onClick={handleConfirmSetup} className={`px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition flex items-center gap-2 transform active:scale-95 ${!ownerPin ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-200'}`}><Save size={18} /> {ownerPin ? `ยืนยัน (${petType === 'dog' ? 'สุนัข' : 'แมว'})` : 'กรุณาใส่รหัส PIN'}</button></div>
                </div>
             </div>
        </div>
    );
};
// --- GROOMER PROFILE & SETTINGS ---
const GroomerDetail = ({ groomer, onBack, onSave }) => {
    const [activeTab, setActiveTab] = useState('profile'); 
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState(groomer);

    // Reuse work history logic: Aggregate from CUSTOMERS_MOCK
    const workHistory = useMemo(() => {
        let history = [];
        CUSTOMERS_MOCK.forEach(customer => {
            if (customer.history) {
                const groomerJobs = customer.history.filter(h => h.groomerId === groomer.id || h.groomer === groomer.name);
                groomerJobs.forEach(job => {
                    history.push({
                        ...job,
                        petName: customer.pet.name,
                        petType: customer.pet.type, // dog, cat
                        breed: customer.pet.breed
                    });
                });
            }
        });
        return history.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [groomer]);

    useEffect(() => { setFormData(groomer); }, [groomer]);

    const handleSaveProfile = () => { onSave(formData); setIsEditing(false); };

    if (!groomer) return null;

    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800"><ArrowLeft /></button>
                    <div className="relative group">
                        <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg"><img src={formData.image} className="w-full h-full object-cover" /></div>
                        {isEditing && (<div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-black/50 transition"><Camera className="text-white" size={24} /></div>)}
                    </div>
                    {isEditing ? (
                        <div className="space-y-3">
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="text-2xl font-bold text-gray-900 border border-gray-200 rounded-lg px-3 py-1 w-full" placeholder="ชื่อจริง" />
                            <input type="text" value={formData.nickname} onChange={(e) => setFormData({...formData, nickname: e.target.value})} className="text-gray-500 font-medium border border-gray-200 rounded-lg px-3 py-1 w-full" placeholder="ชื่อเล่น" />
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 mb-1"><h2 className={`${FONTS.header} text-2xl font-bold text-gray-900`}>{formData.name}</h2>{formData.reviewsCount > 50 && (<span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full border border-indigo-200 font-bold flex items-center gap-1"><Star size={12} /> Top Groomer</span>)}</div>
                            <p className="text-gray-500 font-medium mb-3">"{formData.nickname}"</p>
                            <div className="flex gap-2 flex-wrap">{formData.awards.map((award, i) => (<span key={i} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded border border-yellow-200 font-bold flex items-center gap-1"><Trophy size={12} className="fill-yellow-500 text-yellow-500" /> {award}</span>))}</div>
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    {activeTab === 'profile' && !isEditing && (<button onClick={() => setIsEditing(true)} className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 flex items-center gap-2"><Edit size={16} /> แก้ไขโปรไฟล์</button>)}
                    {isEditing && (<div className="flex gap-2"><button onClick={() => { setIsEditing(false); setFormData(groomer); }} className="px-4 py-2 rounded-lg text-gray-500 font-bold text-sm hover:bg-gray-100">ยกเลิก</button><button onClick={handleSaveProfile} className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-md">บันทึก</button></div>)}
                    {!isEditing && (<div className="bg-gray-100 p-1 rounded-lg flex"><button onClick={()=>setActiveTab('profile')} className={`px-4 py-2 rounded-md font-bold text-sm transition ${activeTab==='profile' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Profile</button><button onClick={()=>setActiveTab('settings')} className={`px-4 py-2 rounded-md font-bold text-sm transition ${activeTab==='settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>Settings</button></div>)}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8">
                {activeTab === 'profile' ? (
                    <div className="grid grid-cols-12 gap-8">
                        <div className="col-span-4 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity size={18}/> Skill Radar</h3><RadarChart stats={formData.stats} /></div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Tag size={18}/> Specialization</h3>{isEditing ? (<textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm h-32 focus:ring-2 focus:ring-indigo-100 outline-none" value={formData.skills.join(', ')} onChange={(e) => setFormData({...formData, skills: e.target.value.split(',').map(s => s.trim())})} placeholder="ใส่ความถนัด (คั่นด้วยเครื่องหมายจุลภาค)" />) : (<div className="flex flex-wrap gap-2">{formData.skills.map(skill => (<span key={skill} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 cursor-default">{skill}</span>))}</div>)}</div>
                            {isEditing && (<div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Trophy size={18}/> Awards</h3><textarea className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 focus:ring-2 focus:ring-indigo-100 outline-none" value={formData.awards.join(', ')} onChange={(e) => setFormData({...formData, awards: e.target.value.split(',').map(s => s.trim())})} placeholder="ใส่รางวัล (คั่นด้วยเครื่องหมายจุลภาค)" /></div>)}
                        </div>
                        <div className="col-span-8 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><History size={18}/> Work History (Latest)</h3>{workHistory.length > 0 ? (<div className="space-y-4">{workHistory.map((job, i) => (<div key={i} className="flex justify-between items-start p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-indigo-100">{job.petType === 'dog' ? '🐶' : job.petType === 'cat' ? '🐱' : '🐾'}</div><div><p className="font-bold text-gray-900 text-lg">{job.petName} <span className="text-sm font-normal text-gray-500">({job.breed})</span></p><p className="text-sm text-gray-500 flex items-center gap-2"><Clock size={14}/> {job.date}<span className="w-1 h-1 bg-gray-300 rounded-full"></span>{job.service}</p>{job.comment && <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg italic">"{job.comment}"</p>}</div></div><div className="text-right"><div className="flex text-yellow-400 mb-1 justify-end">{[...Array(5)].map((_, si) => (<Star key={si} size={14} fill={si < job.rating ? "currentColor" : "none"} className={si < job.rating ? "text-yellow-400" : "text-gray-200"} />))}</div><p className="font-bold text-emerald-600 text-lg">{job.price} ฿</p></div></div>))}</div>) : (<div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200"><History size={32} className="mx-auto mb-2 opacity-30" /><p>ยังไม่มีประวัติการทำงาน</p></div>)}</div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><SlidersHorizontal size={18}/> Work Settings</h3><div className="grid grid-cols-2 gap-6"><div><label className="block text-sm font-bold text-gray-700 mb-2">Commission Rate (%)</label><input type="number" defaultValue={groomer.commissionRate} className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div><div><label className="block text-sm font-bold text-gray-700 mb-2">Daily Wage (Optional)</label><input type="number" placeholder="0.00" className="w-full px-4 py-2 border border-gray-200 rounded-xl" /></div><div className="col-span-2"><label className="block text-sm font-bold text-gray-700 mb-2">Working Schedule</label><div className="flex gap-2">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (<button key={d} className={`flex-1 py-2 rounded-lg border ${groomer.schedule.includes(d) || ['Mon','Tue','Wed','Thu','Fri'].includes(d) ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-400 border-gray-200'}`}>{d}</button>))}</div></div></div></div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"><h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase size={18}/> Portability</h3><p className="text-sm text-gray-500 mb-4">Groomer สามารถย้ายร้านได้โดยการ Transfer Profile ID ข้อมูลประวัติการทำงานและรีวิวจะถูกย้ายตามไปด้วย</p><div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex justify-between items-center"><code className="text-lg font-mono font-bold text-gray-700">GROOM-ID-{groomer.id}-X89</code><button className="text-indigo-600 font-bold text-sm flex items-center gap-2 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition"><Share2 size={16}/> Transfer Profile</button></div></div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- 3. GROOMING MODULE ---
const GroomingModule = ({ onNavigate, setIsDrawerOpen }) => {
    const [activePage, setActivePage] = useState('booking');
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS_DATA);
    const [services, setServices] = useState(GROOMING_SERVICES_MOCK);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isQuickSetupOpen, setIsQuickSetupOpen] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);

    // Initial Data Handler
    const handleOpenBooking = (initialData = null) => {
        const defaultData = {
            customerId: '',
            groomerId: GROOMERS[0].id,
            serviceId: '',
            startTime: '10:00',
            endTime: '11:00', // ✅ Default End Time
            weight: '',
            note: ''
        };
        setEditingAppointment({ ...defaultData, ...initialData });
        setIsBookingModalOpen(true);
    };

    const handleSaveAppointment = (appData) => {
        if (editingAppointment && editingAppointment.id) {
            setAppointments(prev => prev.map(a => a.id === appData.id ? appData : a));
        } else {
            setAppointments(prev => [...prev, { ...appData, id: `A${Date.now()}` }]);
        }
    };
    
    // Service Merger (Using JS Map correctly)
    const handleSaveServices = (newServices) => {
        setServices(prev => {
            const serviceMap = new Map(prev.map(s => [s.id, s]));
            newServices.forEach(s => serviceMap.set(s.id, s)); 
            return Array.from(serviceMap.values());
        });
        alert(`บันทึกเรียบร้อย: สร้าง/อัปเดต ${newServices.length} รายการ`);
    };

    const renderContent = () => {
        if (activePage === 'booking') {
            return <BookingCalendar appointments={appointments} setAppointments={setAppointments} onOpenModal={handleOpenBooking} />;
        }
        if (activePage === 'staff') {
            if (selectedGroomer) {
                return <GroomerDetail groomer={selectedGroomer} onBack={() => setSelectedGroomer(null)} />;
            }
            return (
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto h-full bg-gray-50">
                     {GROOMERS.map(g => (
                         <div key={g.id} onClick={() => setSelectedGroomer(g)} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md hover:border-indigo-300 transition group relative overflow-hidden">
                             <div className="flex items-center gap-4 mb-4">
                                 <img src={g.image} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm" />
                                 <div>
                                     <h3 className="font-bold text-lg text-gray-900 group-hover:text-indigo-600 transition">{g.name}</h3>
                                     <div className="flex items-center gap-1 text-yellow-500 text-sm font-bold"><Star size={14} fill="currentColor"/> {g.rating} ({g.reviewsCount})</div>
                                 </div>
                             </div>
                             <div className="flex flex-wrap gap-2 mb-4">
                                 {g.awards.length > 0 && <span className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded border border-yellow-200 font-bold">🏆 Award Winner</span>}
                                 {g.skills.slice(0,2).map(s => <span key={s} className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded">{s}</span>)}
                             </div>
                             <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm text-gray-500">
                                 <span>{g.schedule}</span>
                                 <span className="text-indigo-600 font-bold flex items-center gap-1">View Profile <ChevronRight size={14} /></span>
                             </div>
                         </div>
                     ))}
                     <button className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition min-h-[200px]">
                         <Plus size={32} />
                         <span className="font-bold mt-2">Add New Groomer</span>
                     </button>
                </div>
            );
        }
        if (activePage === 'services') {
             return (
                 <div className="p-8 h-full bg-gray-50 flex flex-col">
                     <div className="flex justify-between items-center mb-6"><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>Services & Pricing</h2><button onClick={() => setIsQuickSetupOpen(true)} className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 flex items-center gap-2 shadow-sm"><Zap size={18} className="fill-indigo-600" /> Quick Setup Matrix</button></div>
                     <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                         <div className="overflow-y-auto flex-1 custom-scrollbar">
                             <table className="w-full">
                                 <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10"><tr><th className="p-4 text-left font-bold text-gray-600">Service Name</th><th className="p-4 text-left font-bold text-gray-600">Type</th><th className="p-4 text-left font-bold text-gray-600">Duration</th><th className="p-4 text-right font-bold text-gray-600">Price</th><th className="p-4"></th></tr></thead>
                                 <tbody className="divide-y divide-gray-100">{services.map(s => (<tr key={s.id} className="hover:bg-gray-50"><td className="p-4 font-bold text-gray-800">{s.name}{s.isQuickSetup && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">AUTO</span>}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${s.type==='dog' ? 'bg-indigo-50 text-indigo-600' : 'bg-pink-50 text-pink-600'}`}>{s.type}</span></td><td className="p-4 text-gray-500">{s.duration} min</td><td className="p-4 text-right font-bold text-emerald-600">{s.price} ฿</td><td className="p-4 text-right text-gray-400"><MoreHorizontal size={18} /></td></tr>))}</tbody>
                             </table>
                         </div>
                     </div>
                 </div>
             );
        }
        if (activePage === 'clients') {
             return (
                 <div className="p-8 h-full bg-gray-50"><div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col"><h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 mb-6`}>Client History</h2><div className="flex-1 overflow-y-auto">{CUSTOMERS_MOCK.map(c => (<div key={c.id} className="border-b border-gray-100 py-4 last:border-0"><div className="flex justify-between items-start mb-2"><div className="flex items-center gap-4"><div className="text-3xl">{c.pet.img}</div><div><h4 className="font-bold text-lg text-gray-900">{c.pet.name} <span className="text-sm font-normal text-gray-500">({c.pet.breed})</span></h4><p className="text-sm text-gray-500">Owner: {c.name} • {c.phone}</p></div></div><button className="text-indigo-600 text-sm font-bold">View Details</button></div>{c.history && c.history.length > 0 && (<div className="ml-14 bg-gray-50 p-3 rounded-xl text-sm space-y-2 mt-2">{c.history.map((h, i) => (<div key={i} className="flex justify-between text-gray-600"><span>{h.date} - {h.service} (by {h.groomer})</span><span className="font-bold">{h.price} ฿</span></div>))}</div>)}</div>))}</div></div></div>
             );
        }
        return <div className="p-10 text-center text-gray-400">Page under construction: {activePage}</div>;
    };

    return (
        <div className="h-screen w-full bg-[#F3F4F6] flex overflow-hidden">
            <GroomingSidebar onNavigate={onNavigate} activePage={activePage} onChangePage={(id) => { setSelectedGroomer(null); setActivePage(id); }} onOpenDrawer={() => setIsDrawerOpen(true)} />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4"><button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden"><Menu size={24} className="text-gray-600" /></button><h1 className={`${FONTS.header} text-xl font-bold text-gray-800 capitalize`}>{activePage === 'booking' ? 'ตารางนัดหมาย' : activePage}</h1></div>
                    <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">A</div></div>
                </header>
                <div className="flex-1 overflow-hidden relative">{renderContent()}</div>
            </div>
            <AppointmentModal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} appointment={editingAppointment} onSave={(data) => { handleSaveAppointment(data); setIsBookingModalOpen(false); }} onDelete={() => {}} services={services} />
            <QuickSetupModal isOpen={isQuickSetupOpen} onClose={() => setIsQuickSetupOpen(false)} onConfirm={handleSaveServices} />
        </div>
    );
};

// --- 4. APPOINTMENT MODAL ---
const AppointmentModal = ({ isOpen, onClose, appointment, onSave, onDelete, services = [] }) => {
    if (!isOpen) return null;
    
    const availableServices = services.length > 0 ? services : GROOMING_SERVICES_MOCK;
    const [isNewCustomer, setIsNewCustomer] = useState(false);
    const [formData, setFormData] = useState({
        customerId: '',
        groomerId: GROOMERS[0].id,
        serviceId: '',
        startTime: '10:00',
        endTime: '11:00',
        weight: '',
        note: ''
    });

    useEffect(() => {
        if(appointment) {
            setFormData(appointment);
        } else {
             setFormData({
                customerId: '',
                groomerId: GROOMERS[0].id,
                serviceId: '',
                startTime: '10:00',
                endTime: '11:00',
                weight: '',
                note: ''
            });
        }
    }, [appointment]);

    const addMinutes = (time, minutes) => {
        if (!time || typeof time !== 'string') return '10:00'; // Guard Clause
        try {
            const [h, m] = time.split(':').map(Number);
            const date = new Date();
            date.setHours(h);
            date.setMinutes(m + minutes);
            return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        } catch (e) { return time; }
    };

    useEffect(() => {
        if (formData.serviceId) {
            const service = availableServices.find(s => s.id === formData.serviceId);
            if (service && formData.startTime) {
                setFormData(prev => ({
                    ...prev,
                    endTime: addMinutes(prev.startTime, service.duration)
                }));
            }
        }
    }, [formData.serviceId, formData.startTime]);

    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
                 <div className="flex justify-between items-center p-6 border-b border-gray-100"><h2 className={`${FONTS.header} text-xl font-bold text-gray-800`}>{appointment?.id ? 'แก้ไขนัดหมาย' : 'ลงนัดหมายใหม่'}</h2><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button></div>
                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex justify-between mb-3"><label className="block text-sm font-bold text-gray-700">ข้อมูลลูกค้า</label><button onClick={() => setIsNewCustomer(!isNewCustomer)} className="text-xs text-indigo-600 font-bold underline">{isNewCustomer ? 'ค้นหาลูกค้าเดิม' : '+ สร้างลูกค้าใหม่'}</button></div>
                        {isNewCustomer ? (<div className="grid grid-cols-2 gap-3"><input placeholder="ชื่อลูกค้า" className="px-3 py-2 border rounded-lg" /><input placeholder="เบอร์โทร" className="px-3 py-2 border rounded-lg" /><input placeholder="ชื่อสัตว์เลี้ยง" className="px-3 py-2 border rounded-lg" /><input placeholder="สายพันธุ์" className="px-3 py-2 border rounded-lg" /></div>) : (<div className="relative"><Search className="absolute left-3 top-3 text-gray-400" size={16} /><input type="text" placeholder="ค้นหาลูกค้า..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-100" /></div>)}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">ช่างตัดขน</label><select value={formData.groomerId} onChange={(e) => setFormData({...formData, groomerId: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white">{GROOMERS.map(g => <option key={g.id} value={g.id}>{g.name} ({g.nickname})</option>)}</select></div>
                        <div><label className="block text-sm font-bold text-gray-700 mb-2">เวลาเริ่ม</label><input type="time" value={formData.startTime} onChange={(e) => setFormData({...formData, startTime: e.target.value})} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl" /></div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">เลือกบริการ</label>
                        <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto border border-gray-100 rounded-xl p-2 bg-white">{availableServices.map(s => (<label key={s.id} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${formData.serviceId === s.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-gray-200 hover:border-indigo-300 text-gray-700'}`}><div className="flex items-center gap-3"><input type="radio" name="service" className="hidden" checked={formData.serviceId === s.id} onChange={() => setFormData({...formData, serviceId: s.id})} /><div><p className="font-bold text-sm">{s.name}</p><span className="text-xs opacity-80">{s.duration} mins</span></div></div><span className="font-bold">{s.price} ฿</span></label>))}</div>
                    </div>
                </div>
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3"><button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-200 transition">ยกเลิก</button><button onClick={() => onSave(formData)} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition">บันทึกนัดหมาย</button></div>
            </div>
        </div>
    );
};

// ==========================================
// ZONE B: CORE APPLICATION & GLOBAL STATE
// ==========================================

const App = () => {
// 1. SYSTEM & NAVIGATION
  const [currentView, setCurrentView] = useState('home');                // App-start here
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [settings, setSettings] = useState(SYSTEM_DEFAULTS);
// 2. DATABASE STATE
  const [products, setProducts] = useState(PetProductsDB);
  const [membersDB, setMembersDB] = useState(INITIAL_MEMBERS_DB);
  const [currentMember, setCurrentMember] = useState(INITIAL_MEMBERS_DB[0]);
// 3. GROOMING STATE
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS_DATA);
  const [groomers, setGroomers] = useState(GROOMERS); // เพิ่ม State พนักงาน
// 4. PURCHASING STATE (เพิ่มใหม่ เพื่อให้แก้สถานะได้)
  const [purchaseOrders, setPurchaseOrders] = useState(MOCK_PURCHASE_ORDERS);
  const [purchaseRequestItems, setPurchaseRequestItems] = useState([]);
// 5. POS STATE
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
// 6. POS STATE - UI  
  const [isMemberSearchOpen, setIsMemberSearchOpen] = useState(false);
// 7. CRM STATE
  const [isNewMemberOpen, setIsNewMemberOpen] = useState(false);
  const [crmSearchTerm, setCrmSearchTerm] = useState('');
  const [crmFilterPet, setCrmFilterPet] = useState(null);
  const [crmFilterLevel, setCrmFilterLevel] = useState('ทั้งหมด');
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);

  // ==========================================
  // ZONE D: LOGIC & HANDLERS
  // ==========================================

  const handleNavigate = (viewId) => {
    setCurrentView(viewId);
    setIsDrawerOpen(false);
  };

  // --- POS Logic ---
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
          stock: product.stock || 99,
          promo: null,
          qty: 1,
          unit: product.unit || 'ชิ้น',
          code: product.code || 'NEW',
          type: product.type || 'product'
        };
        return [...prevItems, newItem];
      }
    });
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => sum + ((item.price * item.qty) - (item.discount || 0)), 0);
  };

  // --- Purchasing Logic ---
  const addToPurchaseRequest = (product, quantity) => {
      setPurchaseRequestItems(prev => {
          if (quantity <= 0) {
              return prev.filter(p => p.id !== product.id);
          }
          const exists = prev.find(p => p.id === product.id);
          if (exists) return prev.map(p => p.id === product.id ? {...p, qty: quantity} : p);
          return [...prev, {...product, qty: quantity}];
      });
  };

  const handleUpdatePOStatus = (id, newStatus) => {
        setPurchaseOrders(prev => prev.map(po => po.id === id ? { ...po, status: newStatus } : po));
  };

  // --- CRM Logic ---
  const togglePetFilter = (pet) => {
    setCrmFilterPet(prev => prev === pet ? null : pet);
  };

  // Filter Members Logic (Global for access in render)
  const filteredCRMMembers = useMemo(() => {
    return membersDB.filter(member => {
        const matchesSearch = member.name.includes(crmSearchTerm) || member.phone.includes(crmSearchTerm) || member.id.includes(crmSearchTerm);
        const matchesPet = crmFilterPet ? member.pets.includes(crmFilterPet) : true;
        const matchesLevel = crmFilterLevel !== 'ทั้งหมด' ? member.level === crmFilterLevel : true;
        return matchesSearch && matchesPet && matchesLevel;
    });
  }, [membersDB, crmSearchTerm, crmFilterPet, crmFilterLevel]);

  // ==========================================
  // ZONE E: MAIN RENDERER
  // ==========================================

  const renderContent = () => {
    switch (currentView) {
        case 'home':
            return (
                <div className="bg-[#141419] min-h-screen w-full flex flex-col overflow-hidden text-white font-sans selection:bg-purple-500 selection:text-white">
                  <style>{`@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&family=Sarabun:wght@300;400;500;600&display=swap'); .custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-track { background: transparent; } .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(156, 163, 175, 0.5); border-radius: 20px; }`}</style>
                  <header className="h-16 theme.sidebar.bg flex items-center justify-between px-6 border-b border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-purple-900/50"><span className={`${FONTS.header} font-bold text-xl`}>P</span></div>
                        <div><h1 className={`${FONTS.header} font-bold text-lg leading-tight`}>{settings.shopName}</h1><p className={`${FONTS.body} text-xs text-purple-400 font-medium`}>{settings.branch}</p></div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 bg-[#2A2A32] px-3 py-1.5 rounded-full border border-gray-700"><div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className={`${FONTS.body} text-sm text-gray-300`}>Online</span></div>
                        <div className="flex items-center gap-3 bg-[#2A2A32] pl-4 pr-2 py-1.5 rounded-full border border-gray-700 cursor-pointer hover:bg-[#32323c] transition group">
                            <div className="text-right"><p className={`${FONTS.header} text-sm font-bold text-white group-hover:text-purple-300 transition`}>ผู้จัดการร้าน</p><p className={`${FONTS.body} text-xs text-gray-400 uppercase tracking-wider`}>Admin Access</p></div>
                            <div className="w-9 h-9 rounded-full bg-gradient-to-r from-gray-700 to-gray-600 flex items-center justify-center border border-gray-500 shadow-inner"><User size={16} className="text-gray-300" /></div>
                        </div>
                    </div>
                  </header>
                  <main className="flex-1 p-6 overflow-hidden">
                    <div className="grid grid-cols-12 gap-6 h-full">
                        {/* ✅ ส่ง Props ข้อมูลจริงเข้าไปที่นี่ */}
                        <div className="col-span-3 flex flex-col gap-6 h-full">
                            <div className="h-[55%]"><SalesChart data={SALES_HISTORY_DB} /></div> {/* ใช้ billHistory ถ้าอยากได้ Realtime */}
                            <div className="h-[45%]"><ServiceQueue data={appointments} /></div>
                        </div>
                        <div className="col-span-3 flex flex-col gap-6 h-full">
                            <div className="h-[55%]"><OrderList data={products} /></div>
                            <div className="h-[45%]"><MessageBox data={SALES_HISTORY_DB} /></div>
                        </div>
                        <div className="col-span-6 h-full"><MainMenuGrid onNavigate={handleNavigate} /></div>
                    </div>
                  </main>
                </div>
            );

        case 'pos':
            return (
                <POSModule 
                    cartItems={cartItems}
                    setCartItems={setCartItems}
                    currentMember={currentMember}
                    recommendedItems={RECOMMENDED_ITEMS} // Static for now, can be state later
                    handleNavigate={handleNavigate}
                    setIsDrawerOpen={setIsDrawerOpen}
                    setIsMemberSearchOpen={setIsMemberSearchOpen}
                    setIsNewMemberOpen={setIsNewMemberOpen}
                    addToCart={addToCart}
                    calculateTotal={calculateTotal}
                    settings={settings}
                />
            );

        case 'crm':
            return (
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
                    membersDB={membersDB}
                />
            );

        case 'purchasing':
            return (
                <PurchasingModule 
                    products={products}
                    handleNavigate={handleNavigate}
                    setIsDrawerOpen={setIsDrawerOpen}
                    purchaseRequestItems={purchaseRequestItems}
                    addToPurchaseRequest={addToPurchaseRequest}
                />
            );

        case 'grooming':
            return (
                <GroomingModule 
                    onNavigate={handleNavigate}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
            );

		case 'settings':
            return (
                <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
                    <SettingsSidebar onOpenDrawer={() => setIsDrawerOpen(true)} onNavigate={handleNavigate} activePage="general" onChangePage={()=>{}} />
                    <div className="flex-1 flex flex-col min-w-0">
                        <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between shrink-0"><h1 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ตั้งค่าทั่วไป</h1></header>
                        <div className="p-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-6">
                                <h3 className="font-bold text-lg mb-4">ข้อมูลร้านค้า</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div><label className="block text-sm font-bold text-gray-700 mb-1">ชื่อร้าน</label><input type="text" value={settings.shopName} onChange={(e) => setSettings({...settings, shopName: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                                    <div><label className="block text-sm font-bold text-gray-700 mb-1">สาขา</label><input type="text" value={settings.branch} onChange={(e) => setSettings({...settings, branch: e.target.value})} className="w-full border rounded-lg p-2" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        default:
            const modules = {
              dashboard: { title: 'Dashboard Analytics', icon: LayoutDashboard },
              promo: { title: 'จัดการโปรโมชั่น', icon: Tag },
              expenses: { title: 'บันทึกค่าใช้จ่าย', icon: Receipt },
              help: { title: 'ศูนย์ช่วยเหลือ', icon: HelpCircle },
              master: { title: 'Master Data', icon: Database },
              contacts: { title: 'รายชื่อผู้ติดต่อ', icon: Contact },
              reports: { title: 'รายงาน', icon: FileBarChart },
            };
            const currentModule = modules[currentView];
            if (currentModule) {
              return <PlaceholderModule title={currentModule.title} icon={currentModule.icon} handleNavigate={handleNavigate} setIsDrawerOpen={setIsDrawerOpen} />;
            }
            return <div className="h-screen flex items-center justify-center text-red-500 font-bold">Error: Module not found ({currentView})</div>;
    }
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

      {currentView !== 'home' && (
        <button
          onClick={() => handleNavigate('home')}
          className="fixed bottom-6 right-6 theme.sidebar.bg hover:bg-gray-800 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] z-50 transition-all duration-300 border-2 border-[#FCD34D] hover:scale-110 active:scale-95 group flex items-center gap-2 overflow-hidden"
          title="กลับหน้า Home"
        >
          <Home size={24} className="text-[#FCD34D] fill-current" />
          <span className={`${FONTS.header} font-bold max-w-0 group-hover:max-w-xs transition-all duration-500 ease-in-out opacity-0 group-hover:opacity-100 whitespace-nowrap text-[#FCD34D]`}>HOME</span>
        </button>
      )}
    </>
  );
};

export default App;
