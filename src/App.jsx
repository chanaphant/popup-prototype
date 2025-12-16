import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as LucideIcons from 'lucide-react';
const {
  // Layout & Navigation
  LayoutDashboard, Store, Calendar, CalendarDays, Users, Package, Tag, Receipt, Settings, HelpCircle,
  Home, Menu, LogOut, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, ArrowLeft, Monitor, StoreIcon,
  CornerUpLeft, Layers, 
  
  // Actions & UI
  Search, Plus, Minus, X, Check, Save, Edit, Edit2, Trash2, RefreshCcw, RefreshCw, 
  Download, Upload, Share2, Copy, Printer, Scan, Filter, MoreHorizontal, Power, Move,
  PlusCircle, MousePointerClick, LayoutTemplate, Type,
  Filter as FilterIcon, 
  
  // Status & Feedback
  Bell, CheckCircle, CheckCircle2, AlertCircle, AlertTriangle, Lock, Unlock, ShieldCheck, 
  Ban, XCircle, CheckSquare, Square, Star, Heart, Zap, Award, Trophy,
  Sparkles, Target, 
  Star as StarIcon, 
  
  // Objects & Entities
  Smartphone, FileText, CreditCard, Wallet, QrCode, Coins, Banknote, Truck, 
  ShoppingBasket, ShoppingCart, Camera, Globe, MapPin, Gift,
  Box, Phone, 
  
  // Animals & Grooming
  Dog, Cat, Rabbit, Fish, Bird, Feather, Scissors, Activity, HeartPulse, Hexagon,
  PawPrint, 
  
  // Business & Data
  TrendingUp, Percent, Database, FileBarChart, FileSearch, Briefcase, SlidersHorizontal, 
  FileCheck, ClipboardCheck, FileInput, FileOutput, List, Grid,
  List as ListIcon, Grid as GridIcon, 
  
  // Communication & People
  MessageSquare, MessageCircle, Mail, Megaphone, User, UserCheck, Contact,
  
  // Time
  Clock, Clock3, ClockIcon, History,
  
  // Features (Home & Settings)
  Wifi, Music, BoxSelect, FileSpreadsheet, Stethoscope, Building,
  Server, Bluetooth, Usb, ShoppingBag,
  
  // Icons for Settings Upgrade (Full Set)
  Facebook, Instagram, Twitter, Linkedin, GlobeIcon,
  Landmark, CreditCard as CreditCardIcon, Calculator, AlertOctagon, Barcode, 
  CalendarClock, ShieldAlert, PenTool, MousePointer2, Maximize, ZoomIn, ZoomOut, 
  Eraser, RotateCcw, Palette, ArrowRightCircle, Video, FileCheck as FileCheckIcon, 
  Power as PowerIcon, Smartphone as SmartphoneIcon,
  
  // Renamed Imports (Correction Here)
  Map as MapIcon,
  Calendar as CalendarIcon, 
  Image as ImageIcon, // ✅ แก้ไขจาก PhotoIcon เป็น Image as ImageIcon
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

// --- 1. NEW SETTINGS CONFIG (from Theme & Setup) ---
const INITIAL_SETTINGS = {
  shopName: 'Pet Omni Store',
  branch: 'สาขาหลัก (Main)',
  taxRate: 7, // VAT %
  currency: 'THB',
  currencySymbol: '฿',
  salesMode: 'retail',
  rounding: 'floor', 
  shiftStart: '08:00',
  theme: 'dark', // Default theme
  onlineChannels: { line: true, shopee: false, lazada: false, tiktok: false },
  notifications: { stock: true, shift: true, sound: true },
  musicVolume: 50
};
// --- PET OMNI STORE ---
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

// --- GROOMING DATA (Existing) ----------------------------------------------------------
const GROOMING_SERVICES = [ // Renamed from GROOMING_SERVICES_MOCK
  { id: 'S001', name: 'อาบน้ำ - สุนัขเล็ก (S) <5kg', duration: 60, price: 300, type: 'dog', category: 'Bath', weightRangeIdx: 1 }, // S: 1-3 kg
  { id: 'S002', name: 'อาบน้ำ - สุนัขกลาง (M) 5-15kg', duration: 90, price: 450, type: 'dog', category: 'Bath', weightRangeIdx: 4 }, // XL: 8-12 kg
  { id: 'S003', name: 'ตัดขน - สุนัขเล็ก (S) <5kg', duration: 90, price: 500, type: 'dog', category: 'Cut', weightRangeIdx: 2 }, // M: 3-5 kg
  { id: 'S004', name: 'ตัดขน - สุนัขกลาง (M) 5-15kg', duration: 120, price: 700, type: 'dog', category: 'Cut', weightRangeIdx: 5 }, // 2XL: 12-15 kg
  { id: 'S006', name: 'อาบน้ำ - แมว (S)', duration: 60, price: 400, type: 'cat', category: 'Bath', weightRangeIdx: 2 }, // M: 3-5 kg
  { id: 'S008', name: 'สปาโคลนหมักขน', duration: 30, price: 200, type: 'spa', category: 'Spa', weightRangeIdx: -1 }, // All sizes
];

const PRODUCTS_MOCK = [
    { id: 'P001', name: 'อาหารเม็ดพรีเมียม (Dog) 1kg', price: 1250, duration: 0, type: 'food', category: 'Food', color: 'bg-green-100 text-green-700' },
    { id: 'P002', name: 'แชมพูสูตรอ่อนโยน 250ml', price: 450, duration: 0, type: 'retail', category: 'Retail Product', color: 'bg-red-100 text-red-700' },
    { id: 'P003', name: 'ของเล่นยางกัดรูปกระดูก', price: 150, duration: 0, type: 'retail', category: 'Retail Product', color: 'bg-red-100 text-red-700' },
    { id: 'P004', name: 'ขนมขัดฟันสำหรับแมว', price: 99, duration: 0, type: 'food', category: 'Food', color: 'bg-green-100 text-green-700' },
    { id: 'P005', name: 'ปลอกคอกันเห็บหมัด M', price: 350, duration: 0, type: 'retail', category: 'Retail Product', color: 'bg-red-100 text-red-700' },
    { id: 'P006', name: 'สเปรย์ดับกลิ่นห้องน้ำสัตว์', price: 290, duration: 0, type: 'retail', category: 'Retail Product', color: 'bg-red-100 text-red-700' },
    { id: 'P007', name: 'อาหารเปียก Tuna Flavor (Cat)', price: 35, duration: 0, type: 'food', category: 'Food', color: 'bg-green-100 text-green-700' },
];

const ALL_SALES_ITEMS = [
    ...GROOMING_SERVICES.map(s => ({ ...s, isService: true, color: 'bg-teal-100 text-teal-700', serviceType: s.type, filterType: 'grooming' })),
    ...PRODUCTS_MOCK.map(p => ({ ...p, isService: false, serviceType: p.type, filterType: 'products' })),
];

const SERVICE_CATEGORIES = [
    { id: 'all', name: 'ทั้งหมด', icon: List, color: 'gray' },
    { id: 'grooming', name: 'บริการ Grooming', icon: Scissors, color: 'teal', bgColor: 'bg-teal-500' },
    { id: 'products', name: 'สินค้าปลีก', icon: ShoppingCart, color: 'red', bgColor: 'bg-red-500' },
    { id: 'food', name: 'อาหาร/ขนม', icon: Dog, color: 'green', bgColor: 'bg-green-500' },
    { id: 'spa', name: 'สปาพิเศษ', icon: HeartPulse, color: 'pink', bgColor: 'bg-pink-500' },
];

// Mock Client History (What they bought/used previously)
const CLIENT_HISTORY_MOCK = [
    { memberId: '0811111111', petId: 'PET001', itemId: 'S003', name: 'ตัดขน - สุนัขเล็ก', price: 500, date: '2025-12-01', isService: true, type: 'dog' },
    { memberId: '0811111111', petId: 'PET009', itemId: 'P001', name: 'อาหารเม็ดพรีเมียม 1kg', price: 1250, date: '2025-11-15', isService: false, type: 'food' },
    { memberId: '0892222222', petId: 'PET002', itemId: 'S006', name: 'อาบน้ำ - แมว (S)', price: 400, date: '2025-12-10', isService: true, type: 'cat' },
    { memberId: '0892222222', petId: 'PET002', itemId: 'P002', name: 'แชมพูสูตรอ่อนโยน', price: 450, date: '2025-12-10', isService: false, type: 'retail' },
    { memberId: '0856789012', petId: 'PET005', itemId: 'S004', name: 'ตัดขน - สุนัขกลาง', price: 700, date: '2025-11-20', isService: true, type: 'dog' },
    { memberId: '0856789012', petId: 'PET005', itemId: 'P005', name: 'ปลอกคอกันเห็บหมัด M', price: 350, date: '2025-11-20', isService: false, type: 'retail' },
    { memberId: '0811111111', petId: 'PET001', itemId: 'S008', name: 'สปาโคลนหมักขน', price: 200, date: '2025-12-01', isService: true, type: 'spa' },
];

// Review Data
const REVIEWS = [ // Renamed from MOCK_REVIEWS
    { id: 'R001', petName: 'น้องหมูตุ๋น', ownerName: 'คุณสมชาย', text: 'ช่างแนนมือเบามาก น้องหมาหลับปุ๋ยเลย ทรงสวยถูกใจสุดๆ! แนะนำเลยค่ะ', rating: 5 },
    { id: 'R002', petName: 'น้องโอเลี้ยง', ownerName: 'คุณบาส', text: 'ช่างบอยตัดไวมาก น้องไม่เครียดเลย บริการดีเยี่ยมครับ', rating: 4 },
    { id: 'R003', petName: 'น้องมาร์นี่', ownerName: 'คุณวิภา', text: 'ถึงจะเป็นแมวก็ยังอาบน้ำได้เนี๊ยบ ขนฟูสวยไม่พันกันเลยค่ะ', rating: 5 },
    { id: 'R004', petName: 'น้องรถถัง', ownerName: 'คุณเอ', text: 'น้องมีโรคประจำตัว ช่างดูแลดีมากเป็นพิเศษ ทำให้รู้สึกปลอดภัย', rating: 5 },
];

const GROOMERS = [
  { 
    id: 'G01', name: 'ช่างแนน', nickname: 'Nan', color: 'bg-pink-100 border-pink-200 text-pink-700',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    awards: ['แชมป์ตัดขนสไตล์เกาหลี 2023', 'ขวัญใจมหาชน'], skills: ['สุนัขเล็ก', 'Poodle Style', 'ทำสี', 'งานละเอียด'],
    stats: { beauty: 5, neatness: 4.8, care: 5, speed: 3.5, service: 4.9 }, reviewsCount: 128, rating: 4.9, commissionRate: 40, schedule: 'Mon-Fri',
    bio: 'ยินดีต้อนรับค่ะ! แนนรักการสร้างสรรค์ทรงขนสไตล์เกาหลีที่น่ารักและเป็นเอกลักษณ์ทุกวันค่ะ',
    expertise: { dog: ['Poodle', 'Maltese', 'Shih Tzu'], cat: [], other: ['ทำสีขน', 'สไตล์เกาหลี', 'สปาพรีเมียม'] },
    pinnedReviewIds: ['R001', 'R003'],
    
    // NEW DATA for Work History and Tenure
    joinDate: '2022-03-15', // For tenure calculation
    qualifications: ['Certified Master Groomer (Level 3)', 'Pet First Aid & CPR'],
    staffPIN: '9876', // Mock staff PIN for transfer demo
    workHistory: [
      { year: '2019 - 2022', employer: 'Happy Paws Salon', role: 'Junior Groomer' },
      { year: '2022 - Present', employer: 'Pet Omni Store', role: 'Senior Groomer' },
    ]
  },
  { 
    id: 'G02', name: 'ช่างบอย', nickname: 'Boy', color: 'bg-blue-100 border-blue-200 text-blue-700',
    image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&w=150&q=80',
    awards: ['รองชนะเลิศ Creative Grooming'], skills: ['สุนัขใหญ่', 'แมวดุ', 'งานไถ', 'ตัดทรงมาตรฐาน'],
    stats: { beauty: 4.2, neatness: 4.5, care: 4.8, speed: 5, service: 4.5 }, reviewsCount: 45, rating: 4.6, commissionRate: 35, schedule: 'Tue-Sun',
    bio: 'บอยถนัดจัดการน้องหมาใหญ่และน้องแมวที่ดื้อครับ เน้นความรวดเร็วและปลอดภัยเป็นหลัก ตัดทรงมาตรฐานได้หลากหลายสไตล์',
    expertise: { dog: ['Golden Retriever', 'Bulldog'], cat: ['แมวขนสั้น', 'แมวขนยาว'], other: ['งานไถขน', 'ตัดเล็บ/เช็ดหู'] },
    pinnedReviewIds: ['R002', 'R004'],
    
    // NEW DATA for Work History and Tenure
    joinDate: '2020-08-01', 
    qualifications: ['Pet Stylist Certified (PSC)', 'Expert in Large Breeds'],
    staffPIN: '1357',
    workHistory: [
      { year: '2016 - 2020', employer: 'Big Dogs Grooming', role: 'Apprentice' },
      { year: '2020 - Present', employer: 'Pet Omni Store', role: 'Master Groomer' },
    ]
  },
  { 
    id: 'G03', name: 'ช่างก้อย', nickname: 'Koi', color: 'bg-green-100 border-green-200 text-green-700',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
    awards: [], skills: ['อาบน้ำ', 'เป่าขน', 'สปา', 'ตัดเล็บ'],
    stats: { beauty: 3.8, neatness: 4.5, care: 4.9, speed: 4.0, service: 4.8 }, reviewsCount: 12, rating: 4.5, commissionRate: 30, schedule: 'Weekend Only',
    bio: 'ก้อยรักงานอาบน้ำและสปาเป็นพิเศษค่ะ รับรองว่าน้องๆ จะตัวหอม สะอาด และรู้สึกผ่อนคลายทุกครั้งที่มาใช้บริการ',
    expertise: { dog: ['Shih Tzu', 'Pomeranian'], cat: [], other: ['สปาผ่อนคลาย', 'ดูแลผิวหนัง'] },
    pinnedReviewIds: [],

    // NEW DATA for Work History and Tenure
    joinDate: '2024-01-20', 
    qualifications: ['Basic Grooming Certificate', 'Aromatherapy Pet Spa'],
    staffPIN: '2468',
    workHistory: [
      { year: '2023', employer: 'Freelance', role: 'Assistant' },
      { year: '2024 - Present', employer: 'Pet Omni Store', role: 'Spa Specialist' },
    ]
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

// --- PROMOTION MOCK DATA ---
const PROMO_MOCK_DATA = {
    products: [
        { id: 'P001', name: 'อาหารสุนัข สูตร 1 (RC)', brand: 'Royal Canin', category: 'Food', price: 2700 },
        { id: 'P002', name: 'ขนมแมวเลีย (Me-O)', brand: 'Me-O', category: 'Snack', price: 300 },
        { id: 'P003', name: 'แชมพูสุนัข (Vet)', brand: 'Vetsolution', category: 'Care', price: 120 },
        { id: 'P004', name: 'กระเป๋าหิ้วแมว', brand: 'Cat Carrier Co', category: 'Accessory', price: 850 },
        { id: 'P005', name: 'Hill\'s Science Diet 5kg', brand: 'Hill\'s', category: 'Food', price: 1550 },
        { id: 'P006', name: 'กระบะทรายขนาดใหญ่', brand: 'Cat Litter Co', category: 'Accessory', price: 499 },
        { id: 'P007', name: 'ของเล่นยางกัด', brand: 'Dog Toy Inc', category: 'Toy', price: 180 },
    ],
    brands: [
        { id: 'B01', name: 'Royal Canin' },
        { id: 'B02', name: 'Me-O' },
        { id: 'B03', name: 'Vetsolution' },
        { id: 'B04', name: 'Cat Carrier Co' },
        { id: 'B05', name: 'Hill\'s' },
        { id: 'B06', name: 'Cat Litter Co' },
        { id: 'B07', name: 'Dog Toy Inc' },
    ],
    categories: ['Food', 'Snack', 'Care', 'Accessory', 'Toy'],
    savedTemplates: [
        // Added targetProductIds to mock data for the edit function
        { id: 'T01', name: 'Flash Sale 20% OFF (Food)', type: 'discount', target: 'All Food', status: 'Active', isFavorite: true, valueUsed: 12500, goal: 15000, lastRun: { period: 'Jan 2024', revenue: 13500 }, targetProductIds: ['P001', 'P005'] },
        { id: 'T02', name: 'RC Buy 3 Get 1', type: 'bogo', target: 'Royal Canin', status: 'Starting Soon', isFavorite: false, valueUsed: 0, goal: 50000, lastRun: { period: 'Dec 2023', revenue: 48000 }, targetProductIds: ['P001'] },
        { id: 'T03', name: 'Bundle Cat Litter 2/100', type: 'bundle', target: 'Cat Litter', status: 'Expired', isFavorite: false, valueUsed: 8000, goal: 8000, lastRun: { period: 'May 2024', revenue: 7950 }, targetProductIds: ['P006'] },
        { id: 'T04', name: 'Dog Toy Clearance', type: 'discount', target: 'Dog Toys', status: 'Active', isFavorite: true, valueUsed: 400, goal: 1000, lastRun: { period: 'N/A', revenue: 0 }, targetProductIds: ['P007'] },
    ],
    rewards: [
        { id: 'R01', name: 'คูปองลด 50 บาท', cost: 1000, type: 'coupon' },
        { id: 'R02', name: 'ผ้าเช็ดตัวฟรี', cost: 2500, type: 'item' },
        { id: 'R03', name: 'ส่วนลด 10%', cost: 4500, type: 'coupon' },
    ]
};

// --- NEW MOCK DATA FOR SMART RECOMMENDATIONS ---
const RECOMMENDATIONS_MOCK = [
    {
        id: 'REC-001',
        promoName: 'ลด 15% อาหารสุนัขขายช้า',
        reason: 'สินค้านับล่าสุดเกิน 150 วัน (นาน)',
        type: 'Discount',
        products: [
            { id: 'P001', name: 'Royal Canin Mini Indoor 3kg', stock: 150, price: 2700, cost: 1620, profitBefore: 40, profitAfter: 25, brand: 'Royal Canin', category: 'Food' },
            { id: 'P005', name: 'Hill\'s Science Diet 5kg', stock: 80, price: 3500, cost: 2275, profitBefore: 35, profitAfter: 20, brand: 'Hill\'s', category: 'Food' }
        ],
        suggestedPromo: { type: 'Discount', value: 15, unit: '%' },
        supplier: { name: 'Royal Canin Thailand', phone: '02-123-4567', lineId: '@royalcanin_th' }
    },
    {
        id: 'REC-002',
        promoName: 'เหมาขนมแมวเลีย (ใกล้หมดอายุ)',
        reason: 'สินค้าใกล้หมดอายุใน 30 วัน (Critical)',
        type: 'Bundle',
        products: [
            { id: 'P002', name: 'Me-O Creamy Treat Tuna (100 ซอง)', stock: 80, price: 300, cost: 270, profitBefore: 10, profitAfter: 1, brand: 'Me-O', category: 'Snack' }
        ],
        suggestedPromo: { type: 'Bundle', value: 3, unit: 'ซอง/100฿' },
        supplier: { name: 'Perfect Companion', phone: '02-987-6543', lineId: '@perfectcomp' }
    },
    {
        id: 'REC-003',
        promoName: 'ล้างสต็อกแชมพู (ค้างนาน)',
        reason: 'สินค้าค้างสต็อกไม่มีความเคลื่อนไหว > 6 เดือน',
        type: 'BOGO',
        products: [
            { id: 'P003', name: 'Vetsolution Derma Shampoo', stock: 12, price: 120, cost: 54, profitBefore: 55, profitAfter: 10, brand: 'Vetsolution', category: 'Care' }
        ],
        suggestedPromo: { type: 'BOGO', value: 1, unit: 'ซื้อ 1 แถม 1' },
        supplier: { name: 'Vetsolution Supply', phone: '02-777-8888', lineId: '@vetsolution' }
    },
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

const INITIAL_EXPENSES = [
    { 
      id: 'EXP-001', title: 'ค่าน้ำประปา', date: '2024-06-01', amount: 450, 
      status: 'สำเร็จ', category: 'สาธารณูปโภค', note: 'จ่ายผ่าน Mobile Banking',
      createdBy: 'Admin', createdAt: '1/6/2024, 10:00:00'
    },
    { 
      id: 'EXP-002', title: 'ค่าไฟฟ้า', date: '2024-06-05', amount: 3200, 
      status: 'สำเร็จ', category: 'สาธารณูปโภค', note: 'เดือน พ.ค.',
      createdBy: 'Manager', createdAt: '5/6/2024, 14:30:00'
    },
    { 
      id: 'EXP-003', title: 'ซื้อกระดาษใบเสร็จ', date: '2024-06-10', amount: 150, 
      status: 'สำเร็จ', category: 'อุปกรณ์สิ้นเปลือง', note: 'ซื้อร้านหน้าปากซอย',
      createdBy: 'Admin', createdAt: '10/6/2024, 09:15:00'
    },
    { 
      id: 'EXP-004', title: 'ซ่อมแอร์', date: '2024-06-12', amount: 1500, 
      status: 'ยกเลิก', category: 'ซ่อมบำรุง', note: 'ช่างเลื่อนนัด',
      createdBy: 'Admin', createdAt: '12/6/2024, 11:00:00',
      cancelledBy: 'Admin', cancelledAt: '12/6/2024, 13:00:00'
    },
];

const EXPENSE_CATEGORIES = [
    { id: 'cat1', label: 'สาธารณูปโภค', icon: Zap, color: 'bg-yellow-100 text-yellow-700' },
    { id: 'cat2', label: 'อุปกรณ์สิ้นเปลือง', icon: BoxSelect, color: 'bg-blue-100 text-blue-700' },
    { id: 'cat3', label: 'ค่าเช่าสถานที่', icon: Building, color: 'bg-purple-100 text-purple-700' },
    { id: 'cat4', label: 'เงินเดือนพนักงาน', icon: Users, color: 'bg-green-100 text-green-700' },
    { id: 'cat5', label: 'ซ่อมบำรุง', icon: Settings, color: 'bg-orange-100 text-orange-700' },
    { id: 'cat6', label: 'อื่นๆ', icon: MoreHorizontal, color: 'bg-gray-100 text-gray-700' },
];

// 1. ธีมของระบบ
const APP_THEMES = {
    luxury: { id: 'luxury', name: 'Luxury Dark', sidebarBg: 'bg-zinc-900', activeBg: 'bg-zinc-800', headerBg: 'bg-zinc-900' },
    lover: { id: 'lover', name: 'Pink Lover', sidebarBg: 'bg-rose-100', activeBg: 'bg-rose-200', headerBg: 'bg-white' },
    lightly: { id: 'lightly', name: 'Simply White', sidebarBg: 'bg-white', activeBg: 'bg-gray-100', headerBg: 'bg-white' }
};

// --- NEW HOME/DRAWER DATA (from Theme & Setup) ---
const INITIAL_HOME_MODULES = [
  { id: 'pos', title: 'POS ขายหน้าร้าน', icon: Store, color: 'bg-[#3B3068]', text: 'text-purple-300' },
  { id: 'grooming', title: 'จองคิว (Grooming)', icon: CalendarDays, color: 'bg-[#065F46]', text: 'text-emerald-300' },
  { id: 'crm', title: 'สมาชิก CRM', icon: Users, color: 'bg-[#026AA7]', text: 'text-sky-300' },
  { id: 'purchasing', title: 'ซื้อสินค้า', icon: Package, color: 'bg-[#0F766E]', text: 'text-teal-300' },
  { id: 'promo', title: 'โปรโมชั่น', icon: Tag, color: 'bg-[#BE123C]', text: 'text-rose-300' },
  { id: 'expenses', title: 'ค่าใช้จ่าย', icon: Receipt, color: 'bg-[#15803D]', text: 'text-green-300' },
  { id: 'master', title: 'จัดการข้อมูล', icon: Database, color: 'bg-[#4B5563]', text: 'text-gray-300' }, 
  { id: 'stock_count', title: 'ตรวจนับสินค้า', icon: BoxSelect, color: 'bg-[#D97706]', text: 'text-amber-300' },
  { id: 'reports', title: 'รายงาน', icon: FileBarChart, color: 'bg-[#4338CA]', text: 'text-indigo-300' },
  { id: 'online', title: 'ช่องทางออนไลน์', icon: Globe, color: 'bg-[#0EA5E9]', text: 'text-cyan-300' },
  { id: 'pet_match', title: 'แนะนำสัตว์เลี้ยง', icon: Heart, color: 'bg-[#EC4899]', text: 'text-pink-300' },
  { id: 'breeder', title: 'จัดหาผู้เลี้ยง', icon: User, color: 'bg-[#8B5CF6]', text: 'text-violet-300' },
  { id: 'contacts', title: 'รายชื่อผู้ติดต่อ', icon: FileSpreadsheet, color: 'bg-[#64748B]', text: 'text-slate-300' },
  { id: 'clinic', title: 'คลีนิคสัตว์เลี้ยง', icon: Stethoscope, color: 'bg-[#EF4444]', text: 'text-red-300' },
  { id: 'goals', title: 'ตั้งเป้าหมาย', icon: Target, color: 'bg-[#14B8A6]', text: 'text-teal-300' },
  { id: 'branch', title: 'จัดการสาขา', icon: Building, color: 'bg-[#F59E0B]', text: 'text-yellow-300' },
  { id: 'iot', title: 'IoT Control', icon: Wifi, color: 'bg-[#6366F1]', text: 'text-indigo-300' },
  { id: 'music', title: 'เพลงในร้าน', icon: Music, color: 'bg-[#10B981]', text: 'text-emerald-300' },
  { id: 'settings', title: 'ตั้งค่าร้าน', icon: Settings, color: 'bg-[#1F2937]', text: 'text-gray-300' },
  { id: 'help', title: 'ศูนย์ช่วยเหลือ', icon: HelpCircle, color: 'bg-[#C2410C]', text: 'text-orange-300' },
];

//----- รายการ ใน drawer-----
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

// --- DASHBOARD WIDGETS (Stubbed for performance) ---
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
// --- DASHBOARD WIDGETS (Stubbed for performance) ---
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

// --- DASHBOARD WIDGETS (Stubbed for performance) ---
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

// === DASHBOARD GRID
const MainMenuGrid = ({ onNavigate }) => (
  <div className="h-full flex flex-col">
    <div className="flex items-center gap-2 mb-4"><LayoutDashboard className="text-purple-400 w-6 h-6" /><h2 className={`${FONTS.header} text-white text-xl font-bold`}>เมนูหลัก</h2></div>
    <div className="grid grid-cols-3 gap-4 flex-1">{MAIN_MENUS.map((menu) => (<button key={menu.id} onClick={() => onNavigate(menu.id)} className={`${menu.color} ${menu.hover} rounded-3xl p-6 flex flex-col justify-center items-center gap-4 transition-all duration-300 transform hover:scale-[1.02] shadow-xl group`}><div className={`p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors`}><menu.icon size={40} className="text-white" /></div><span className={`${FONTS.header} text-white text-xl font-bold tracking-wide`}>{menu.title}</span></button>))}</div>
  </div>
);

// === SEARCH MEMBER POP UP ---
const MemberSearchPopup = ({ isOpen, onClose, members, onSelectMember, onOpenNewMember }) => {
  const [searchTerm, setSearchTerm] = useState('');
  if (!isOpen) return null;
  const filtered = members ? members.filter(m => m.name.includes(searchTerm) || m.phone.includes(searchTerm)) : [];
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose}></div><div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in duration-200"><div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50"><div><h3 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ค้นหาสมาชิก</h3><p className={`${FONTS.body} text-sm text-gray-500`}>กรอกชื่อ หรือ เบอร์โทรศัพท์</p></div><button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition text-gray-500"><X size={24} /></button></div><div className="p-6 pb-2"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input type="text" autoFocus placeholder="ค้นหาชื่อ, เบอร์โทร..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`${FONTS.header} w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition text-lg`} /></div></div><div className="flex-1 overflow-y-auto p-4 custom-scrollbar">{filtered.length > 0 ? (<div className="space-y-2">{filtered.map(member => (<div key={member.id} onClick={() => onSelectMember(member)} className="p-4 rounded-xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50 cursor-pointer transition flex items-center justify-between group"><div className="flex items-center gap-4"><div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg ${member.theme === 'amber' ? 'bg-amber-400' : member.theme === 'purple' ? 'bg-purple-500' : member.theme === 'gray' ? 'bg-gray-400' : 'bg-slate-400'}`}>{member.name.charAt(4)}</div><div><h4 className={`${FONTS.header} font-bold text-gray-800`}>{member.name}</h4><p className={`${FONTS.body} text-sm text-gray-500 flex items-center gap-1`}><Smartphone size={12} /> {member.phone}</p></div></div><div className="text-right"><span className={`text-xs px-2 py-1 rounded-full font-bold ${member.levelColor || 'bg-gray-100 text-gray-600'}`}>{member.level}</span><p className="text-emerald-600 text-sm font-bold mt-1">{member.points.toLocaleString()} pts</p></div></div>))}</div>) : (<div className="flex flex-col items-center justify-center h-40 text-gray-400"><User size={48} className="mb-2 opacity-20" /><p>ไม่พบรายชื่อสมาชิก</p><button onClick={() => {onClose(); onOpenNewMember();}} className="mt-4 text-emerald-600 font-bold hover:underline">+ เพิ่มสมาชิกใหม่</button></div>)}</div></div></div>
  );
};


// === CREATE MEMBER POP UP
const NewMemberPopup = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ phone: '', nickname: '', lineId: '', dogs: 0, cats: 0, rabbits: 0 });
  if (!isOpen) return null;
  const handleCounter = (type, op) => { setFormData(prev => ({ ...prev, [type]: op === 'inc' ? prev[type] + 1 : Math.max(0, prev[type] - 1) })); };
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4"><div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div><div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"><div className="bg-emerald-600 p-6 text-white flex justify-between items-start"><div><h3 className={`${FONTS.header} text-2xl font-bold`}>สมาชิกใหม่</h3><p className={`${FONTS.body} text-emerald-100 text-sm opacity-90`}>กรอกข้อมูลเพื่อสมัครสมาชิกด่วน</p></div><button onClick={onClose} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition"><X size={20} /></button></div><div className="p-6 space-y-5"><div className="space-y-4"><div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-1 block`}>เบอร์โทรศัพท์ (ใช้เป็น Member ID)</label><div className="relative"><Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} /><input type="tel" className={`${FONTS.header} w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition font-bold text-lg text-gray-800 tracking-wide`} placeholder="0XX-XXX-XXXX" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} /></div></div><div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-1 block`}>ชื่อเล่นลูกค้า</label><input type="text" className={`${FONTS.header} w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-emerald-500 outline-none transition`} placeholder="เช่น คุณเมย์, น้องจอย" value={formData.nickname} onChange={e => setFormData({...formData, nickname: e.target.value})} /></div></div><div><label className={`${FONTS.header} text-sm font-bold text-gray-700 mb-2 block`}>จำนวนน้องๆ ที่เลี้ยง</label><div className="grid grid-cols-3 gap-3">{[{ id: 'dogs', label: 'สุนัข', icon: '🐶', color: 'bg-orange-50 border-orange-200 text-orange-600' }, { id: 'cats', label: 'แมว', icon: '🐱', color: 'bg-blue-50 border-blue-200 text-blue-600' }, { id: 'rabbits', label: 'กระต่าย', icon: '🐰', color: 'bg-pink-50 border-pink-200 text-pink-600' }].map(pet => (<div key={pet.id} className={`flex flex-col items-center p-2 rounded-xl border ${pet.color} transition-all`}><span className="text-2xl mb-1">{pet.icon}</span><span className={`${FONTS.header} text-xs font-bold mb-2`}>{pet.label}</span><div className="flex items-center gap-2 bg-white rounded-lg shadow-sm border border-black/5 px-1 py-1"><button onClick={() => handleCounter(pet.id, 'dec')} className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-md text-gray-600 transition">-</button><span className="font-bold text-gray-800 w-4 text-center text-sm">{formData[pet.id]}</span><button onClick={() => handleCounter(pet.id, 'inc')} className="w-6 h-6 flex items-center justify-center bg-emerald-100 hover:bg-emerald-200 rounded-md text-emerald-600 transition">+</button></div></div>))}</div></div></div><div className="p-6 pt-0 flex gap-3"><button onClick={onClose} className={`${FONTS.header} flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition`}>ยกเลิก</button><button onClick={() => {alert('Added!'); onClose();}} className={`${FONTS.header} flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-200 transition active:scale-95`}>+ เพิ่มสมาชิก</button></div></div></div>
  );
};

// === GLOBAL BAR
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

// ===SIDEBAR LAYOUT
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


// ===POS Sidebar 
const POSSidebar = ({ onOpenDrawer, onNavigate, activeTab, onTabChange }) => {
    const menuItems = [
        { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true },
        { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
        { icon: Store, label: 'ระบบขายหน้าร้าน', id: 'terminal', action: () => onTabChange('terminal') },
		{ icon: Users, label: 'ลูกค้า & CRM', id: 'posCRM',action: () => onTabChange ('members') },         //  
		{ icon: Package, label: 'คลังสินค้า',  id: 'posInv',action: () => onTabChange ('overview') },        //
        { icon: FileText, label: 'ประวัติบิล', id: 'history', action: () => onTabChange('history') },
        { icon: Receipt, label: 'ลิ้นชักเก็บเงิน', id: 'cashDrawer', action: () => onTabChange('cashDrawer') },
        { icon: Smartphone, label: 'พนักงานมือถือ' },
        { icon: CalendarDays, label: 'ตารางนัดหมาย' },
        { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activeTab} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />;
};

// ===CRM Sidebar 
const CRMSidebar = ({ onOpenDrawer, onNavigate, activeTab, onTabChange }) => {
    const menuItems = [
      { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true },
      { icon: Bell, label: 'การแจ้งเตือน', badge: 99 },
      { icon: Users, label: 'สมาชิก', id: 'members', action: () => onTabChange('members') },
      { icon: Feather, label: 'สัตว์เลี้ยง', id: 'pets', action: () => onTabChange('pets') },
      { icon: MessageCircle, label: 'Line OA', id: 'line_oa', action: () => onTabChange('line_oa') },
      { icon: Megaphone, label: 'BroadCast' },
      { icon: Settings, label: 'ตั้งค่า', id: 'settings', action: () => onTabChange('settings') },
      { icon: LogOut, label: 'กลับหน้า Home', action: () => onNavigate('home'), bottom: true },
    ];
    return <BaseSidebarLayout menuItems={menuItems} activePage={activeTab} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />;
};

// ===Purchasing Sidebar (Refactored)
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

// ===Grooming Sidebar (Refactored to Wrapper)
const GroomingSidebar = ({ onNavigate, onOpenDrawer, activePage, onChangePage }) => {
  menuItems = [
    { icon: Menu, label: 'เมนูหลัก', action: onOpenDrawer, id: 'menu', highlight: true }, // Drawer opener
    { icon: CalendarDays, label: 'ตารางนัดหมาย', id: 'booking', action: () => onChangePage('booking') },
    { icon: Users, label: 'ประวัติลูกค้า', id: 'clients', action: () => onChangePage('clients') },
    { icon: Scissors, label: 'บริการ & ราคา', id: 'services', action: () => onChangePage('services') },
    { icon: UserCheck, label: 'พนักงาน (Groomer)', id: 'staff', action: () => onChangePage('staff') },
    { icon: Settings, label: 'ตั้งค่า Grooming', id: 'settings_grooming', action: () => onNavigate('settings'), bottom: true }, // Link to main settings
    { icon: LogOut, label: 'ออกจากระบบ', id: 'logout', action: () => onNavigate('home'), bottom: true }, // Log out item
  ];

  return <BaseSidebarLayout menuItems={menuItems} activePage={activePage} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} titleIcon={Scissors} title="Pet Salon" />;
};

// ===Settings Sidebar (Refactored)
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
                      {currentMemberPets.length > 0 ? (currentMemberPets.map((pet, i) => (<div key={i} className="flex flex-col items-center gap-1 cursor-pointer group w-[3.5rem]"><div className="relative w-10 h-10 rounded-full bg-orange-100 border-2 border-white shadow-sm flex items-center justify-center text-lg group-hover:scale-110 transition">{getPetEmoji(pet.type)}{pet.chronicDiseases && pet.chronicDiseases.length > 0 && (<div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-white text-[8px] flex items-center justify-center border border-white">!</div>)}</div><span className={`${FONTS.header} text-[10px] font-bold text-gray-600 truncate w-full text-center`}>{pet.name}</span></div>))) : (<div className="flex flex-col items-center justify-center w-full py-1 text-gray-400 opacity-50"><Feather size={20} className="mb-0.5"/><span className="text-[10px]">ไม่พบสัตว์เลี้ยง</span></div>)}
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


// ---- PO INFO
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

// --- 2. GOODS RECEIPT DETAIL
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

// ---- PAYMENT STATUS ---
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

// --- CART VIEW (ORDER With Approval) ---
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

// ========= OVERVIEW PURCHASE MODULE ========
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
// ZONE E : GROOMING
// ==========================================

const getWeightRangeIndex = (weightKg) => {
    if (weightKg < 1) return 0; // (XS) <1 kg
    if (weightKg < 3) return 1; // (S) 1-3 kg
    if (weightKg < 5) return 2; // (M) 3-5 kg
    if (weightKg < 8) return 3; // (L) 5-8 kg
    if (weightKg < 12) return 4; // (XL) 8-12 kg
    if (weightKg < 15) return 5; // (2XL) 12-15 kg
    if (weightKg < 25) return 6; // (3XL) 15-25 kg
    if (weightKg <= 40) return 7; // (4XL) 25-40 kg
    return -1; // Out of range or > 40kg
};

const getPetData = (petId) => PetsDB.find(p => p.id === petId);
const getMemberData = (memberId) => INITIAL_MEMBERS_DB.find(m => m.id === memberId);
const getPetByOwner = (memberId) => {
  // 1. หาข้อมูลลูกค้าจาก memberId ก่อน
  const member = INITIAL_MEMBERS_DB.find(m => m.id === memberId);
  
  // 2. ถ้าไม่เจอลูกค้า หรือลูกค้าไม่มีสัตว์เลี้ยง ให้คืนค่าว่าง
  if (!member || !member.petIds) return [];

  // 3. เอารหัสสัตว์เลี้ยง (petIds) ไปดึงข้อมูลรายละเอียดจาก PetsDB
  return member.petIds.map(petId => PetsDB.find(p => p.id === petId)).filter(Boolean);
};
const getReviewData = (reviewId) => REVIEWS.find(r => r.id === reviewId); // Updated to use REVIEWS

const getClientHistory = (memberId) => CLIENT_HISTORY_MOCK.filter(h => h.memberId === memberId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

const getItemDetails = (itemId) => ALL_SALES_ITEMS.find(item => item.id === itemId);

const calculateTenure = (joinDate) => {
    const today = new Date();
    const joined = new Date(joinDate);
    const diffTime = Math.abs(today.getTime() - joined.getTime());
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    
    if (diffYears < 1) {
        const diffMonths = Math.round(diffYears * 12);
        return `${diffMonths} เดือน`;
    }
    return `${diffYears.toFixed(1)} ปี`;
};

// FIX 1: Move addMinutes utility out of AppointmentModal for general use
const addMinutes = (time, minutes) => {
    const [h, m] = time.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m + minutes);
    // Ensure time slot is formatted correctly (e.g., 9:0 -> 09:00)
    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// NEW UTILITY: Expands a single appointment into multiple sequential calendar slots
const getPetSlotTimes = (app) => {
    // Determine the list of pets and their services (using new structure if available, otherwise converting legacy)
    const petEntries = app.petsWithServices || (app.petId ? [{ petId: app.petId, serviceIds: app.serviceIds || [] }] : []);
    
    if (!petEntries || petEntries.length === 0) return [];
    
    const baseStartTime = app.startTime;
    let currentStartTime = baseStartTime;
    
    return petEntries.map(entry => {
        const petData = getPetData(entry.petId);
        if (!petData) return null;

        // Calculate pet's service duration based on item details
        const petDuration = entry.serviceIds.map(id => getItemDetails(id)).reduce((sum, item) => sum + (item?.duration || 0), 0);
        
        // If no services or duration, skip
        if (petDuration === 0) return null;

        const slotStartTime = currentStartTime;
        const slotEndTime = addMinutes(currentStartTime, petDuration);
        
        // Update start time for the next pet's slot
        currentStartTime = slotEndTime;

        // Return a slot object containing pet-specific and appointment-wide data
        return {
            appId: app.id,          // Link to the main appointment object
            petId: entry.petId,
            petName: petData.name,  // Optimized for card display
            groomerId: app.groomerId,
            status: app.status,
            startTime: slotStartTime,
            endTime: slotEndTime,
            serviceIds: entry.serviceIds,
        };
    }).filter(slot => slot); // Filter out nulls
};


// Mock AI Generation function
const generateAIBio = (style, currentGroomer) => {
    const groomerName = currentGroomer.name;
    const skills = currentGroomer.skills.slice(0, 3).join(', '); // Use main 3 skills
    const rating = currentGroomer.rating;

    switch (style) {
        case 'genz':
            return `Yo! ช่าง ${groomerName} เองครับ/ค่ะ ตัดขนสับๆ เทสต์ดีเวอร์! เน้นงานไว งานปัง สกิลคือ ${skills} คะแนนรีวิว ${rating} จึ้งมากแม่! มาทำสวยหล่อกัน! (4 ประโยค)`;
        case 'luxury':
            return `เรียนเชิญสัมผัสประสบการณ์ความงามอันเลิศรสกับช่าง ${groomerName} ผู้เชี่ยวชาญด้าน ${skills} เราให้ความสำคัญกับคุณภาพและความใส่ใจในทุกรายละเอียด ด้วยคะแนนความพึงพอใจสูงถึง ${rating} มอบความไว้วางใจให้เราดูแลสัตว์เลี้ยงของท่านอย่างสมบูรณ์แบบ (4 ประโยค)`;
        case 'friendly':
        default:
            return `สวัสดีครับ/ค่ะ ช่าง ${groomerName} ยินดีให้บริการด้วยใจรัก เราเชี่ยวชาญในด้าน ${skills} และพร้อมดูแลน้องๆ ด้วยความอ่อนโยนเป็นพิเศษ ลูกค้าให้คะแนนความประทับใจถึง ${rating} เชิญมาทำสวยทำหล่อกับเรานะครับ/คะ! (4 ประโยค)`;
    }
};

//=======================================
//  3. PROMOTION MODULE (UPGRADED) 
//=======================================
// Helper component for input rows
const PromoInputRow = ({ label, value, onChange, type = "text", children, unit, wide = false, small = false, readOnly = false }) => (
    <div className={`flex items-center ${wide ? 'justify-start gap-4' : 'justify-between'} py-2`}>
        <label className={`text-gray-600 font-medium ${small ? 'text-sm' : 'text-base'} w-36 shrink-0`}>{label}</label>
        {/* FIX: Use flex-1 for input container to ensure it fills the remaining space gracefully */}
        <div className={`flex items-center gap-2 flex-1`}>
            {children || (
                <input 
                    type={type} 
                    value={value} 
                    onChange={e => onChange(e.target.value)} 
                    readOnly={readOnly}
                    // Design refinement: use text-left for name/target, text-right for number/date
                    className={`flex-1 font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 outline-none transition ${type === 'number' || type === 'date' ? 'text-right' : 'text-left'} ${small ? 'text-sm' : ''} ${readOnly ? 'opacity-70 cursor-not-allowed' : ''}`} 
                    min={0}
                />
            )}
            {unit && <span className="text-gray-400 text-sm w-8 shrink-0">{unit}</span>}
        </div>
    </div>
);

// --- MODAL Component for Editing Promotions (ENHANCED) ---
const PromoEditModal = ({ promo, onClose, onSave }) => {
    const [name, setName] = useState(promo.name);
    const [target, setTarget] = useState(promo.target);
    const [goal, setGoal] = useState(promo.goal);

    // MOCK DATES (Since mock data doesn't have them, use current/future date mocks)
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    
    // Calculation for statistics
    const progressPercent = Math.min(100, (promo.valueUsed / promo.goal) * 100).toFixed(1);
    
    // Maximum number of concurrent promotions allowed
    const MAX_CONCURRENT_PROMOS = 3; 

    // Product Management States
    const initialProducts = useMemo(() => {
        // Mock concurrent count for demonstration purposes. 
        // P001 is set to maxed out (3) to show the disable functionality.
        const mockConcurrentData = {
            'P001': 3, 
            'P002': 1,
            'P003': 0,
            'P004': 2,
            'P005': 1,
            'P006': 0,
            'P007': 2,
        };
        
        const selectedIds = promo.targetProductIds || [];
        return PROMO_MOCK_DATA.products.map(p => {
            const concurrentCount = mockConcurrentData[p.id] || 0;
            const isAlreadySelected = selectedIds.includes(p.id);

            // A product is disabled for selection if its concurrent count equals or exceeds the max.
            // However, if it is *already* in this specific promo (isAlreadySelected), we allow editing the name/details, 
            // but we might want to prevent selection if the count is over max. 
            // For simplicity here, we disable *selection* if maxed out, but always allow *unselection*.
            // We disable the input/row if the concurrent count is at the limit AND the product is NOT currently selected in THIS promo (meaning adding it would break the rule).
            const isDisabled = concurrentCount >= MAX_CONCURRENT_PROMOS && !isAlreadySelected; 
            
            return {
                ...p,
                isSelected: isAlreadySelected,
                concurrentCount: concurrentCount,
                isDisabled: isDisabled,
            };
        });
    }, [promo.targetProductIds]);

    const [products, setProducts] = useState(initialProducts);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterBrand, setFilterBrand] = useState('All');

    const toggleProduct = (id) => {
        setProducts(prev => 
            prev.map(p => {
                // If attempting to select (isSelected: false) and disabled, do nothing.
                if (p.id === id) {
                    if (p.isSelected === false && p.isDisabled) {
                        return p;
                    }
                    return { ...p, isSelected: !p.isSelected };
                }
                return p;
            })
        );
    };

    const handleSelectAll = (shouldSelect) => {
        setProducts(prev => prev.map(p => {
            // Only select if 'shouldSelect' is true AND the product is NOT disabled
            if (shouldSelect && !p.isDisabled) {
                return { ...p, isSelected: true };
            }
            // If unselecting, or if disabled, return the original state
            if (!shouldSelect) {
                 return { ...p, isSelected: false };
            }
            return p;
        }));
    };

    const handleSave = () => {
        const selectedProductIds = products.filter(p => p.isSelected).map(p => p.id);
        
        // Include new date values and basic fields in the saved object
        const newDetails = { 
            name, 
            target, 
            goal: parseFloat(goal), 
            startDate, 
            endDate 
        };

        onSave(promo.id, newDetails, selectedProductIds); // Pass selected IDs
    };

    // Filtered list based on search and filters
    const filteredProducts = useMemo(() => {
        return products.filter(p => {
            const matchesName = p.name.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
            const matchesBrand = filterBrand === 'All' || p.brand === filterBrand;
            return matchesName && matchesCategory && matchesBrand;
        });
    }, [products, searchTerm, filterCategory, filterBrand]);

    const uniqueBrands = useMemo(() => [...new Set(PROMO_MOCK_DATA.products.map(p => p.brand))], []);
    const uniqueCategories = useMemo(() => [...new Set(PROMO_MOCK_DATA.products.map(p => p.category))], []);
    const selectedCount = products.filter(p => p.isSelected).length;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-in fade-in">
            {/* Expanded Modal Width */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] flex flex-col">
                
                {/* Modal Header */}
                <div className="p-6 border-b flex justify-between items-center shrink-0">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Edit2 size={24} className="text-rose-600"/> แก้ไขโปรโมชั่น: <span className="text-blue-600">{promo.name}</span>
                    </h3>
                    <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><X size={20}/></button>
                </div>
                
                {/* Modal Content - Two Columns */}
                <div className="flex-1 flex min-h-0 overflow-hidden">
                    
                    {/* Left Column (w-5/12): Promotion Details - Adjusted width */}
                    <div className="w-5/12 p-6 border-r custom-scrollbar overflow-y-auto">
                        
                        {/* 1. ข้อมูลหลัก */}
                        <h4 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2">1. ข้อมูลหลัก</h4>
                        <div className="bg-gray-50 p-4 rounded-xl space-y-3 border border-gray-200">
                            <PromoInputRow 
                                label="ชื่อโปรโมชั่น" 
                                value={name} 
                                onChange={setName} 
                            />
                            
                            <PromoInputRow 
                                label="กลุ่มเป้าหมาย" 
                                value={target} 
                                onChange={setTarget} 
                            />

                            {/* Added Date Inputs */}
                            <PromoInputRow 
                                label="วันเริ่มต้น" 
                                value={startDate} 
                                onChange={setStartDate} 
                                type="date" 
                            />

                            <PromoInputRow 
                                label="วันสิ้นสุด" 
                                value={endDate} 
                                onChange={setEndDate} 
                                type="date"
                            />

                            <PromoInputRow 
                                label="เป้าหมาย (฿)" 
                                value={goal} 
                                onChange={setGoal} 
                                type="number"
                                unit="บาท"
                            />
                        </div>
                        
                        {/* 2. สถิติและความคืบหน้า */}
                        <h4 className="font-bold text-lg text-gray-800 mb-4 mt-6 border-b pb-2">2. สถิติและความคืบหน้า</h4>
                        
                        {/* Progress Display */}
                        <div className="bg-white p-4 rounded-xl border border-gray-200">
                            <div className="flex justify-between text-sm font-semibold mb-2">
                                <span className="text-gray-700">ความคืบหน้าของเป้าหมาย</span>
                                <span className="text-rose-600">{progressPercent}%</span>
                            </div>
                            
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-rose-500 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${progressPercent > 100 ? 100 : progressPercent}%` }}
                                ></div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-500 mt-2">
                                <span>ยอดใช้ไป: {promo.valueUsed.toLocaleString()} ฿</span>
                                <span>เป้าหมาย: {promo.goal.toLocaleString()} ฿</span>
                            </div>
                        </div>
                        
                        {/* 3. เงื่อนไข */}
                        <h4 className="font-bold text-lg text-gray-800 mb-4 mt-6 border-b pb-2">3. เงื่อนไข</h4>
                        <div className="space-y-2 text-sm">
                            <p><strong>รูปแบบ:</strong> <span className="text-rose-600 font-medium">{promo.type.toUpperCase()}</span></p>
                            <p><strong>สถานะ:</strong> <span className="text-green-600 font-medium">{promo.status}</span></p>
                            <p><strong>รันล่าสุด:</strong> {promo.lastRun.period}</p>
                        </div>
                        
                        {/* Placeholder for complex rule editor */}
                        <div className="mt-6 p-3 bg-yellow-50 border-yellow-200 border rounded-lg text-xs text-gray-600">
                            *รายละเอียดเงื่อนไข (เช่น % ส่วนลด, ซื้อ X แถม Y) จะอยู่ในส่วนแก้ไขเงื่อนไขเฉพาะ
                        </div>
                    </div>
                    
                    {/* Right Column (w-7/12): Product Selector - Adjusted width */}
                    <div className="w-7/12 p-6 flex flex-col min-h-0">
                        <h4 className="font-bold text-lg text-gray-800 mb-4 border-b pb-2 flex items-center justify-between">
                            4. จัดการสินค้าเป้าหมาย 
                            <span className="text-sm font-medium text-rose-600">
                                เลือกแล้ว: {selectedCount} รายการ
                            </span>
                        </h4>

                        {/* Filters Row */}
                        <div className="flex gap-3 mb-4 shrink-0">
                            <div className="relative flex-1">
                                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                                <input 
                                    type="text" 
                                    placeholder="ค้นหาชื่อสินค้า..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-rose-500 outline-none"
                                />
                            </div>
                            <select 
                                value={filterCategory} 
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white w-36"
                            >
                                <option value="All">ทุกหมวดหมู่</option>
                                {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <select 
                                value={filterBrand} 
                                onChange={(e) => setFilterBrand(e.target.value)}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white w-36"
                            >
                                <option value="All">ทุกแบรนด์</option>
                                {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                            </select>
                            <button 
                                onClick={() => handleSelectAll(selectedCount !== products.length)}
                                className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200"
                            >
                                {selectedCount === products.length ? 'ยกเลิกทั้งหมด' : 'เลือกทั้งหมด'}
                            </button>
                        </div>
                        
                        <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800 mb-3 shrink-0">
                            <AlertCircle size={14} className="inline mr-1"/> สินค้าสามารถเข้าร่วมโปรโมชั่นได้ไม่เกิน **{MAX_CONCURRENT_PROMOS}** โปรฯ พร้อมกัน (ปัจจุบันนับรวมโปรฯ นี้ด้วย)
                        </div>

                        {/* Product List Table */}
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="bg-gray-50 border-b text-xs text-gray-500 sticky top-0 z-10">
                                        <th className="p-3 w-10">#</th><th className="p-3">สินค้า</th><th className="p-3 w-20 text-center">โปรฯ ร่วม</th><th className="p-3 text-right">ราคา</th><th className="p-3 w-16 text-center">เลือก</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map(p => (
                                        <tr 
                                            key={p.id} 
                                            className={`border-b last:border-0 hover:bg-gray-50 cursor-pointer 
                                                        ${p.isSelected ? 'bg-rose-50' : ''} 
                                                        ${p.isDisabled ? 'bg-red-50 opacity-70 pointer-events-none' : ''}`} 
                                            onClick={() => toggleProduct(p.id)}
                                        >
                                            <td className="p-3 text-gray-400">{p.id.replace('P00', '')}</td>
                                            <td className="p-3">
                                                <p className={`font-medium text-gray-800 ${p.isDisabled && !p.isSelected ? 'line-through' : ''}`}>{p.name}</p>
                                                <p className="text-xs text-gray-500">{p.brand} ({p.category})</p>
                                            </td>
                                            {/* NEW CELL: Concurrent Promos */}
                                            <td className="p-3 w-20 text-center">
                                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                                    p.concurrentCount >= MAX_CONCURRENT_PROMOS ? 'bg-red-100 text-red-700' : 
                                                    p.concurrentCount > 0 ? 'bg-yellow-100 text-yellow-700' : 
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {p.concurrentCount}
                                                </span>
                                            </td>
                                            <td className="p-3 text-right font-bold text-gray-600">{p.price.toLocaleString()} ฿</td>
                                            <td className="p-3 w-16 text-center">
                                                <input 
                                                    type="checkbox" 
                                                    checked={p.isSelected}
                                                    disabled={p.isDisabled && !p.isSelected} // Allow unselecting if it was already selected
                                                    readOnly 
                                                    className={`form-checkbox h-4 w-4 ${p.isDisabled ? 'text-gray-400' : 'text-rose-600'} rounded border-gray-300 focus:ring-rose-500`}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {filteredProducts.length === 0 && (
                                        <tr><td colSpan="5" className="p-6 text-center text-gray-400">ไม่พบสินค้าตามตัวกรองที่เลือก</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

                {/* Modal Footer (fixed at bottom) */}
                <div className="p-4 border-t flex justify-between items-center shrink-0 bg-gray-50 rounded-b-2xl">
                    <p className="text-sm text-gray-600 font-semibold">สินค้าที่เลือก: <span className="text-rose-600">{selectedCount}</span> รายการ</p>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-100 transition">
                            ยกเลิก
                        </button>
                        <button onClick={handleSave} className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold shadow-md hover:bg-rose-700 transition flex items-center gap-2">
                            <Save size={18}/> บันทึกการแก้ไข ({selectedCount})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Active Promo List Component (Left Panel) ---
const ActivePromoList = ({ templates, onSetRecDetail, toggleFavorite, onEditClick }) => {
    const [statusTab, setStatusTab] = useState('Active');
    const filteredTemplates = templates.filter(t => 
        statusTab === 'Active' ? t.status === 'Active' :
        statusTab === 'Starting Soon' ? t.status === 'Starting Soon' :
        t.status === 'Expired'
    );

    const tabs = [
        { id: 'Active', label: 'กำลังใช้งานอยู่', color: 'text-green-600', count: templates.filter(t => t.status === 'Active').length },
        { id: 'Starting Soon', label: 'กำลังเริ่ม', color: 'text-blue-600', count: templates.filter(t => t.status === 'Starting Soon').length },
        { id: 'Expired', label: 'หมดอายุแล้ว', color: 'text-gray-600', count: templates.filter(t => t.status === 'Expired').length },
    ];
    
    // Functionality stub for demonstrating the right panel click
    const handleRecClick = () => {
        // Mock to demonstrate the transition to the recommendation detail view on the right panel
        const firstRec = RECOMMENDATIONS_MOCK[0];
        onSetRecDetail(firstRec);
    }

    return (
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-md h-full flex flex-col">
            <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2 flex items-center justify-between">
                รายการโปรโมชั่นทั้งหมด 
                <button onClick={handleRecClick} className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1">
                    <CornerUpLeft size={14} className="transform rotate-90"/> ไปที่โปรแนะนำ
                </button>
            </h3>

            {/* Status Tabs */}
            <div className="flex justify-between mb-3 border-b border-gray-100">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusTab(tab.id)}
                        className={`py-2 px-3 text-sm font-bold transition-colors ${
                            statusTab === tab.id 
                            ? `${tab.color} border-b-2 border-${tab.color.split('-')[1]}-500`
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* List Items */}
            <div className="space-y-3 flex-1 custom-scrollbar overflow-y-auto pr-2">
                {filteredTemplates.length === 0 && <p className="text-center text-gray-400 py-6">ไม่มีรายการในสถานะนี้</p>}
                {filteredTemplates.map(t => (
                    <div 
                        key={t.id} 
                        className={`p-3 border rounded-xl flex items-center justify-between transition cursor-pointer ${t.status === 'Active' ? 'border-green-300 bg-green-50 hover:bg-green-100' : 'border-gray-200 bg-white hover:bg-gray-100'}`}
                        onClick={() => onEditClick(t)} // <--- ATTACH EDIT CLICK HANDLER
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                {/* Star Icon with Toggle Functionality */}
                                <StarIcon 
                                    size={16} 
                                    className={t.isFavorite ? 'text-yellow-500 fill-yellow-500 cursor-pointer' : 'text-gray-300 cursor-pointer hover:text-yellow-400 hover:fill-yellow-200'}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the main div click if there was one
                                        toggleFavorite(t.id);
                                    }}
                                />
                                <span className="font-bold text-sm text-gray-800 truncate">{t.name}</span>
                            </div>
                            
                            {/* Value / Goal */}
                            <div className="flex items-center text-xs text-gray-600 gap-1.5">
                                <Coins size={12} className="text-green-500"/>
                                <span className="font-semibold text-green-700">{t.valueUsed.toLocaleString()} ฿</span> 
                                <span className="text-gray-400">/ {t.goal.toLocaleString()} ฿ (Target)</span>
                            </div>

                            {/* History */}
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Clock3 size={12} className="text-gray-400"/>
                                <span className="text-gray-600 font-medium">Last Run:</span>
                                {t.lastRun.period === 'N/A' ? (
                                    <span className="text-gray-400 italic">ไม่เคยใช้งาน</span>
                                ) : (
                                    <span>{t.lastRun.period} ({t.lastRun.revenue.toLocaleString()} ฿)</span>
                                )}
                            </div>
                        </div>
                        <button className="text-rose-500 text-xs font-bold px-2 py-1 ml-2 rounded hover:bg-rose-50 shrink-0" onClick={(e) => {
                            e.stopPropagation(); // Prevent duplicate click action
                            onEditClick(t);
                        }}>
                            {t.status === 'Active' ? 'แก้ไข' : t.status === 'Starting Soon' ? 'เปิดใช้งาน' : 'ลบ/เก็บถาวร'}
                        </button>
                    </div>
                ))}
                <div className="h-4"></div>
            </div>
        </div>
    );
}

// --- Smart Recommendation Panel (Right Panel) ---

// Renders the list of recommended promos (Initial View)
const SmartRecsSummary = ({ recommendations, onSelectRec }) => (
    <div className="p-5 space-y-4 bg-white rounded-2xl border border-gray-200 shadow-lg h-full overflow-y-auto custom-scrollbar">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={24} className="text-orange-500 fill-orange-100"/> 
            โปรโมชั่นที่ควรทำช่วงนี้ (Smart Recommendation)
        </h3>

        <div className="space-y-3">
            {recommendations.map(rec => (
                <div 
                    key={rec.id} 
                    onClick={() => onSelectRec(rec)} 
                    className="p-3 border border-orange-200 bg-orange-50 rounded-xl cursor-pointer hover:bg-orange-100 transition-all shadow-sm"
                >
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <Tag size={18} className="text-rose-500"/> {rec.promoName}
                        </h4>
                        <ChevronRight size={20} className="text-gray-400"/>
                    </div>
                    <p className="text-xs text-orange-600 font-medium mt-1">
                        สาเหตุ: {rec.reason.replace(/\s\(.*\)/, '')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        สินค้าที่แนะนำ: {rec.products.length} รายการ | รูปแบบ: {rec.type}
                    </p>
                </div>
            ))}
        </div>
    </div>
);

// Renders the detailed view of a selected recommendation
const SmartRecsDetail = ({ recommendation, onBack, onNavigateToCreate }) => {
    const [selectedProducts, setSelectedProducts] = useState(recommendation.products.map(p => p.id));
    const [filterText, setFilterText] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [filterBrand, setFilterBrand] = useState('All');

    const toggleProductSelection = (productId) => {
        setSelectedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    const filteredProducts = recommendation.products.filter(p => {
        const matchesName = p.name.toLowerCase().includes(filterText.toLowerCase());
        const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
        const matchesBrand = filterBrand === 'All' || p.brand === filterBrand;
        return matchesName && matchesCategory && matchesBrand;
    });

    const uniqueBrands = [...new Set(recommendation.products.map(p => p.brand))];
    const uniqueCategories = [...new Set(recommendation.products.map(p => p.category))];
    
    // Determine the base item for scope comparison
    const baseItem = recommendation.products[0];

    return (
        <div className="p-5 space-y-4 bg-white rounded-2xl border border-gray-200 shadow-lg h-full flex flex-col">
            
            {/* Header and Back Button */}
            <div className="flex items-center mb-3 border-b pb-3">
                <button onClick={onBack} className="p-2 mr-3 text-gray-500 hover:bg-gray-100 rounded-full"><ChevronLeft size={20}/></button>
                <div className="flex-1">
                    <h3 className="font-bold text-xl text-gray-800">{recommendation.promoName}</h3>
                    <p className="text-sm text-orange-600 font-medium">เหตุผล: {recommendation.reason.replace(/\s\(.*\)/, '')}</p>
                </div>
            </div>

            {/* Scope Selection / Action Buttons */}
            <div className="border border-rose-200 bg-rose-50 p-4 rounded-xl space-y-3">
                <h4 className="font-bold text-gray-800 text-sm">เลือกระดับการทำโปรโมชั่น:</h4>
                <div className="flex flex-wrap gap-2">
                    <button className="px-4 py-2 bg-rose-500 text-white rounded-lg text-sm font-bold shadow-md hover:bg-rose-600 transition">
                        {baseItem.name} (ตัวเดียว)
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                        {baseItem.brand} (ทั้งยี่ห้อ)
                    </button>
                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition">
                        {baseItem.category} (ทั้งกลุ่ม)
                    </button>
                    <button className="px-4 py-2 border border-blue-400 text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition">
                        {selectedProducts.length} รายการ (Custom)
                    </button>
                </div>
                <button onClick={() => onNavigateToCreate(recommendation)} className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2 mt-4">
                    <Zap size={18}/> สร้างโปรโมชั่นนี้ทันที
                </button>
            </div>

            {/* Product List and Filters */}
            <h4 className="font-bold text-gray-800 mt-4 mb-2 flex items-center gap-2"><ListIcon size={18}/> รายการสินค้าที่ถูกแนะนำ ({filteredProducts.length}/{recommendation.products.length})</h4>

            {/* Filters Row */}
            <div className="flex gap-2 mb-3">
                <input 
                    type="text" 
                    placeholder="ค้นหาชื่อสินค้า..." 
                    value={filterText} 
                    onChange={(e) => setFilterText(e.target.value)} 
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-rose-500 outline-none"
                />
                <select 
                    value={filterCategory} 
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white w-32"
                >
                    <option value="All">-- หมวดหมู่ --</option>
                    {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select 
                    value={filterBrand} 
                    onChange={(e) => setFilterBrand(e.target.value)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white w-32"
                >
                    <option value="All">-- แบรนด์ --</option>
                    {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
                </select>
            </div>

            {/* Product Table */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b text-xs text-gray-500 sticky top-0 z-10">
                            <th className="p-3 w-10">เลือก</th>
                            <th className="p-3">สินค้า / แบรนด์</th>
                            <th className="p-3 text-right">กำไรหลังโปร (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map(p => {
                            const isSelected = selectedProducts.includes(p.id);
                            return (
                                <tr key={p.id} className={`border-b last:border-0 hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-rose-50' : ''}`} onClick={() => toggleProductSelection(p.id)}>
                                    <td className="p-3">
                                        <input 
                                            type="checkbox" 
                                            checked={isSelected}
                                            readOnly 
                                            className="form-checkbox h-4 w-4 text-rose-600 rounded border-gray-300 focus:ring-rose-500"
                                        />
                                    </td>
                                    <td className="p-3">
                                        <p className="font-medium text-gray-800">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.brand} ({p.category})</p>
                                    </td>
                                    <td className="p-3 text-right font-bold text-red-500">{p.profitAfter}%</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Supplier Info and Contact */}
            <div className="border-t pt-3 mt-auto flex justify-between items-center">
                <div className="text-xs">
                    <p className="font-bold text-gray-700">Supplier: {recommendation.supplier.name}</p>
                    <p className="text-gray-500">โทร: {recommendation.supplier.phone}</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => alert(`Calling Supplier: ${recommendation.supplier.phone}`)} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs font-bold hover:bg-blue-600 transition flex items-center gap-1">
                        <Phone size={14}/> Call
                    </button>
                </div>
            </div>
        </div>
    );
}


// --- Main Promotion Module ---
const PromotionModule = ({ onNavigate, onOpenDrawer }) => {
    const [activeTab, setActiveTab] = useState('active');
    const [savedTemplates, setSavedTemplates] = useState(PROMO_MOCK_DATA.savedTemplates); // State for mutable templates
    // State to hold the selected recommendation detail for the right panel
    const [selectedRecDetail, setSelectedRecDetail] = useState(null); 
    // NEW: State to hold the promotion object currently being edited in the modal
    const [editingPromo, setEditingPromo] = useState(null); 
    
    // Function to toggle the isFavorite status
    const toggleFavorite = (templateId) => {
        setSavedTemplates(prevTemplates =>
            prevTemplates.map(t => 
                t.id === templateId ? { ...t, isFavorite: !t.isFavorite } : t
            )
        );
    };

    // Handlers for the Edit Modal
    const handleEditClick = (promo) => {
        setEditingPromo(promo);
    };

    const handleCloseEditModal = () => {
        setEditingPromo(null);
    };

    const handleSaveEdit = (id, newDetails, selectedProducts) => {
        setSavedTemplates(prevTemplates =>
            prevTemplates.map(t => 
                t.id === id ? { 
                    ...t, 
                    ...newDetails, 
                    targetProductIds: selectedProducts // Save new selected product IDs
                } : t
            )
        );
        alert(`Saved changes for promo ID: ${id}. Targeted Products: ${selectedProducts.length} items.`);
        handleCloseEditModal();
    };


    // Updated menu items to include the new features
    const menuItems = [
        { icon: Menu, label: 'เมนูหลัก', id: 'menu' },
        { icon: Tag, label: 'โปรโมชั่นปัจจุบัน', id: 'active', action: () => { setActiveTab('active'); setSelectedRecDetail(null); } },
        { icon: Plus, label: 'สร้างโปรโมชั่น', id: 'create', action: () => { setActiveTab('create'); setSelectedRecDetail(null); } },
        { icon: Award, label: 'ตั้งค่าคะแนน/รางวัล', id: 'rewards_config', action: () => { setActiveTab('rewards_config'); setSelectedRecDetail(null); } },
        { icon: FileText, label: 'Template โปรโมชั่น', id: 'templates', action: () => { setActiveTab('templates'); setSelectedRecDetail(null); } },
        { icon: PhotoIcon, label: 'ป้ายโฆษณา', id: 'signage', action: () => { setActiveTab('signage'); setSelectedRecDetail(null); } }, 
        { icon: LogOut, label: 'กลับหน้า Home', bottom: true }
    ];

    const handleNavigateToCreate = (rec) => {
        // Mock function to navigate to the create tab and pre-fill details
        alert(`Navigating to 'สร้างโปรโมชั่น' with pre-filled data for: ${rec.promoName}`);
        setActiveTab('create');
        setSelectedRecDetail(null);
    }

    const Content = () => {
        switch(activeTab) {
            case 'create': return <RenderPromotionCreate />;
            case 'rewards_config': return <RenderRewardsConfig />;
            case 'active': 
                return (
                    <div className="p-6 h-full flex flex-col">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Tag className="text-rose-600"/> โปรโมชั่นปัจจุบัน (ภาพรวม)</h2>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
                            
                            {/* Left Column (5/12): Active Promotions List - ขยายใหญ่ขึ้น */}
                            <div className="lg:col-span-5 min-h-full">
                                <ActivePromoList 
                                    templates={savedTemplates} 
                                    onSetRecDetail={setSelectedRecDetail} 
                                    toggleFavorite={toggleFavorite} 
                                    onEditClick={handleEditClick} // Pass edit handler
                                />
                            </div>

                            {/* Right Column (7/12): Smart Recommendation Panel */}
                            <div className="lg:col-span-7 min-h-full">
                                {selectedRecDetail ? (
                                    <SmartRecsDetail 
                                        recommendation={selectedRecDetail} 
                                        onBack={() => setSelectedRecDetail(null)} 
                                        onNavigateToCreate={handleNavigateToCreate}
                                    />
                                ) : (
                                    <SmartRecsSummary 
                                        recommendations={RECOMMENDATIONS_MOCK} 
                                        onSelectRec={setSelectedRecDetail} 
                                    />
                                )}
                            </div>

                        </div>

                        {/* Edit Modal Popup */}
                        {editingPromo && (
                            <PromoEditModal 
                                promo={editingPromo}
                                onClose={handleCloseEditModal}
                                onSave={handleSaveEdit}
                            />
                        )}
                    </div>
                );
            case 'templates':
                return (
                    <div className="p-6">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><FileText className="text-rose-600"/> โปรโมชั่นที่บันทึกไว้ (Templates)</h2>
                        <div className="space-y-3">
                            {savedTemplates.map(t => (
                                <div key={t.id} className="p-4 border rounded-xl bg-white shadow-sm flex justify-between items-center hover:shadow-md transition">
                                    <div>
                                        <p className="font-bold text-gray-800">{t.name} <span className="text-xs bg-gray-100 px-2 py-0.5 rounded ml-2">{t.type.toUpperCase()}</span></p>
                                        <p className="text-sm text-gray-500">Target: {t.target}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.status === 'Active' ? 'bg-green-100 text-green-600' : t.status === 'Draft' ? 'bg-yellow-100 text-yellow-600' : t.status === 'Starting Soon' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                                        <button className="text-rose-600 font-bold text-sm hover:underline">ใช้งาน</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'signage': return (
                <div className="p-6">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Printer className="text-rose-500"/> สร้างป้าย Promotion</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {['A4', 'A5', 'Shelf Talker', 'Sticker'].map(size => (
                            <div key={size} className="aspect-[3/4] bg-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-rose-400 cursor-pointer hover:bg-rose-50 transition">
                                <FileText size={32} className="text-gray-300 mb-2"/>
                                <span className="font-bold text-gray-600">{size}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
            default: return <div className="p-10 text-center text-gray-400">Promotion Feature: {activeTab}</div>;
        }
    }

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
            <BaseSidebarLayout menuItems={menuItems} activePage={activeTab} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} title="Promo" titleIcon={Tag} />
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar"><Content /></div>
        </div>
    );
};

// Renders the main promotion creation form (Retained)
const RenderPromotionCreate = ({ onSaveTemplate }) => {
    // ... [Content of RenderPromotionCreate remains the same]
    const [promoType, setPromoType] = useState('discount'); // discount, bundle, bogo, tiered_spend
    const [promoDetails, setPromoDetails] = useState({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        quantityLimit: 0,
        targetScope: 'all', // all, category, brand, specific_items
        targetValue: [], // Array of categories/brands/item IDs
        // Type specific:
        discount: { type: 'percent', value: 10 },
        bundle: { count: 3, price: 100 },
        bogo: { buyCount: 2, getCount: 1, getItem: 'P002' },
        tiered_spend: { threshold: 500, discountValue: 50, discountType: 'fixed' }
    });
    
    // Targetting/Filtering UI State
    const [filterBy, setFilterBy] = useState('all'); // all, category, brand
    const [selectedTargetItem, setSelectedTargetItem] = useState(null);

    const handleUpdateDetails = (key, value) => setPromoDetails(prev => ({ ...prev, [key]: value }));

    const PromoTypeCard = ({ type, icon: Icon, title, desc, color }) => (
        <div 
            onClick={() => setPromoType(type)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                promoType === type 
                ? `border-${color}-500 bg-${color}-50 shadow-md ring-2 ring-${color}-100` 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon size={24} className={`text-${color}-600`} />
                <div>
                    <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
                    <p className="text-xs text-gray-500">{desc}</p>
                </div>
                {promoType === type && <CheckCircle size={18} className={`text-${color}-600 ml-auto`} />}
            </div>
        </div>
    );

    const renderPromoSpecificSettings = () => {
        switch (promoType) {
            case 'discount': return (
                <div className="space-y-3">
                    <PromoInputRow label="ลดราคา" wide>
                        <select 
                            value={promoDetails.discount.type}
                            onChange={(e) => setPromoDetails(p => ({ ...p, discount: { ...p.discount, type: e.target.value } }))}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-24 text-sm font-medium"
                        >
                            <option value="percent">%</option>
                            <option value="fixed">฿</option>
                        </select>
                        <input 
                            type="number" 
                            value={promoDetails.discount.value}
                            onChange={(e) => setPromoDetails(p => ({ ...p, discount: { ...p.discount, value: e.target.value } }))}
                            className="flex-1 font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-right"
                            min={0}
                        />
                        <span className="text-gray-400 w-8">{promoDetails.discount.type === 'percent' ? '%' : '฿'}</span>
                    </PromoInputRow>
                </div>
            );
            case 'bundle': return (
                <div className="space-y-3">
                    <PromoInputRow label="จำนวนชิ้น" value={promoDetails.bundle.count} onChange={(v) => setPromoDetails(p => ({ ...p, bundle: { ...p.bundle, count: v } }))} type="number" unit="ชิ้น" />
                    <PromoInputRow label="ราคารวม" value={promoDetails.bundle.price} onChange={(v) => setPromoDetails(p => ({ ...p, bundle: { ...p.bundle, price: v } }))} type="number" unit="บาท" />
                </div>
            );
            case 'bogo': return (
                <div className="space-y-3">
                    <PromoInputRow label="ซื้อจำนวน" value={promoDetails.bogo.buyCount} onChange={(v) => setPromoDetails(p => ({ ...p, bogo: { ...p.bogo, buyCount: v } }))} type="number" unit="ชิ้น" />
                    <PromoInputRow label="แถมจำนวน" value={promoDetails.bogo.getCount} onChange={(v) => setPromoDetails(p => ({ ...p, bogo: { ...p.bogo, getCount: v } }))} type="number" unit="ชิ้น" />
                    <PromoInputRow label="สินค้าแถม" wide>
                        <select 
                            value={promoDetails.bogo.getItem}
                            onChange={(e) => setPromoDetails(p => ({ ...p, bogo: { ...p.bogo, getItem: e.target.value } }))}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 flex-1 text-sm font-medium"
                        >
                            <option value="">-- เลือกสินค้าแถม --</option>
                            {PROMO_MOCK_DATA.products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                    </PromoInputRow>
                </div>
            );
            case 'tiered_spend': return (
                <div className="space-y-3">
                    <PromoInputRow label="เมื่อซื้อครบ" value={promoDetails.tiered_spend.threshold} onChange={(v) => setPromoDetails(p => ({ ...p, tiered_spend: { ...p.tiered_spend, threshold: v } }))} type="number" unit="บาท" />
                    <PromoInputRow label="รับส่วนลด" wide>
                        <select 
                            value={promoDetails.tiered_spend.discountType}
                            onChange={(e) => setPromoDetails(p => ({ ...p, tiered_spend: { ...p.tiered_spend, discountType: e.target.value } }))}
                            className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 w-24 text-sm font-medium"
                        >
                            <option value="fixed">฿</option>
                            <option value="percent">%</option>
                        </select>
                        <input 
                            type="number" 
                            value={promoDetails.tiered_spend.discountValue}
                            onChange={(e) => setPromoDetails(p => ({ ...p, tiered_spend: { ...p.tiered_spend, discountValue: e.target.value } }))}
                            className="flex-1 font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-right"
                            min={0}
                        />
                        <span className="text-gray-400 w-8">{promoDetails.tiered_spend.discountType === 'percent' ? '%' : '฿'}</span>
                    </PromoInputRow>
                </div>
            );
            default: return null;
        }
    };

    const renderTargeting = () => (
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-gray-800 flex items-center gap-2"><Target size={18} /> กำหนดกลุ่มเป้าหมาย</h4>
            
            <div className="flex gap-3">
                {['all', 'category', 'brand', 'specific_items'].map(scope => (
                    <button
                        key={scope}
                        onClick={() => handleUpdateDetails('targetScope', scope)}
                        className={`px-4 py-1.5 rounded-full text-sm font-bold transition ${
                            promoDetails.targetScope === scope 
                            ? 'bg-rose-500 text-white shadow-md' 
                            : 'bg-white text-gray-600 border border-gray-300 hover:bg-rose-50'
                        }`}
                    >
                        {scope === 'all' ? 'ทั้งหมด' : scope === 'category' ? 'หมวดหมู่' : scope === 'brand' ? 'แบรนด์' : 'สินค้ารายชิ้น'}
                    </button>
                ))}
            </div>

            {(promoDetails.targetScope === 'category' || promoDetails.targetScope === 'brand') && (
                <div className="flex gap-2 flex-wrap max-h-40 overflow-y-auto custom-scrollbar border p-3 rounded-lg bg-white">
                    {(promoDetails.targetScope === 'category' ? PROMO_MOCK_DATA.categories : PROMO_MOCK_DATA.brands.map(b => b.name)).map(target => {
                        const isSelected = promoDetails.targetValue.includes(target);
                        return (
                            <button
                                key={target}
                                onClick={() => {
                                    handleUpdateDetails('targetValue', isSelected 
                                        ? promoDetails.targetValue.filter(v => v !== target) 
                                        : [...promoDetails.targetValue, target]
                                    );
                                }}
                                className={`px-3 py-1 text-xs font-bold rounded-full transition ${
                                    isSelected 
                                    ? 'bg-rose-100 text-rose-700 border border-rose-300' 
                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                }`}
                            >
                                {target} {promoDetails.targetScope === 'category' ? '(กลุ่ม)' : '(แบรนด์)'}
                            </button>
                        );
                    })}
                </div>
            )}
            
            {/* Advance Filtering (Mock for demonstration) */}
            {(promoDetails.targetScope === 'category' || promoDetails.targetScope === 'brand') && (
                <div className="pt-4 border-t border-gray-200">
                    <h5 className="text-sm font-bold text-gray-700 mb-2">การกรองขั้นสูง (Advanced Filter)</h5>
                    <div className="flex gap-3">
                        <select className="px-3 py-1.5 border rounded-lg text-sm bg-white w-48">
                            <option value="AND">AND (และ)</option>
                            <option value="OR">OR (หรือ)</option>
                        </select>
                        <span className="text-sm text-gray-500 flex items-center">เช่น แบรนด์ [A] **AND** กลุ่ม [Food]</span>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="p-8 max-w-5xl mx-auto w-full animate-in fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Plus size={24} className="text-rose-500"/> สร้างโปรโมชั่นใหม่</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Column 1: Promotion Type Selection */}
                <div className="lg:col-span-1 space-y-4">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">1. เลือกรูปแบบโปรโมชั่น</h3>
                    <div className="space-y-3">
                        <PromoTypeCard type="discount" icon={Percent} title="ลดราคา (%) / บาท" desc="ส่วนลดตรงตามเปอร์เซ็นต์หรือจำนวนเงิน" color="rose" />
                        <PromoTypeCard type="bundle" icon={Box} title="จัดเซ็ตราคา (Bundle)" desc="ซื้อสินค้า N ชิ้น ในราคา X บาท" color="orange" />
                        <PromoTypeCard type="bogo" icon={Gift} title="ซื้อ X แถม Y (BOGO)" desc="ซื้อตามเงื่อนไขเพื่อรับสินค้าแถม" color="emerald" />
                        <PromoTypeCard type="tiered_spend" icon={Coins} title="ใช้จ่ายถึงเกณฑ์ (Tiered Spend)" desc="ลดราคาเมื่อยอดซื้อถึงจำนวนที่กำหนด" color="blue" />
                    </div>
                </div>

                {/* Column 2: Configuration */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Basic Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">2. ตั้งค่าหลัก</h3>
                        <PromoInputRow label="ชื่อโปรโมชั่น" value={promoDetails.name} onChange={(v) => handleUpdateDetails('name', v)} wide />
                        <PromoInputRow label="เริ่มต้น" value={promoDetails.startDate} onChange={(v) => handleUpdateDetails('startDate', v)} type="date" />
                        <PromoInputRow label="สิ้นสุด" value={promoDetails.endDate} onChange={(v) => handleUpdateDetails('endDate', v)} type="date" />
                        <PromoInputRow label="จำกัดจำนวน (Max Use)" value={promoDetails.quantityLimit} onChange={(v) => handleUpdateDetails('quantityLimit', v)} type="number" unit="ครั้ง" />
                    </div>

                    {/* Type Specific Settings */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">3. เงื่อนไขของโปรโมชั่น</h3>
                        {renderPromoSpecificSettings()}
                    </div>
                    
                    {/* Targeting */}
                    {renderTargeting()}
                    
                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button onClick={() => alert('Saved as template!')} className="px-6 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition flex items-center gap-2">
                            <Save size={18}/> บันทึกเป็น Profile
                        </button>
                        <button onClick={() => alert(`Activated Promo: ${promoDetails.name}`)} className="px-8 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-lg hover:bg-rose-700 transition flex items-center gap-2">
                            <Zap size={18}/> เปิดใช้งานโปรโมชั่น
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Renders the reward/point redemption configuration (Retained)
const RenderRewardsConfig = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto w-full animate-in fade-in">
             <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><Trophy size={24} className="text-yellow-500 fill-yellow-500"/> ตั้งค่าคะแนนและรางวัล (Loyalty Rewards)</h2>
             
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                 <h3 className="text-lg font-bold text-gray-800 mb-4">อัตราการสะสมคะแนน</h3>
                 <PromoInputRow label="ยอดซื้อทุก" value={100} type="number" unit="บาท" small>
                     <input type="number" value={100} readOnly className="w-24 text-right font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                 </PromoInputRow>
                 <PromoInputRow label="จะได้รับ" value={1} type="number" unit="แต้ม" small>
                     <input type="number" value={1} readOnly className="w-24 text-right font-bold text-gray-800 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm" />
                 </PromoInputRow>
             </div>

             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800">รายการรางวัลที่แลกได้</h3>
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black"><Plus size={16}/> เพิ่มรางวัลใหม่</button>
                </div>
                
                <div className="space-y-3">
                    {PROMO_MOCK_DATA.rewards.map(reward => (
                        <div key={reward.id} className="p-4 border border-gray-100 rounded-xl flex justify-between items-center bg-gray-50 hover:bg-white transition">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reward.type === 'coupon' ? 'bg-rose-100 text-rose-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                    {reward.type === 'coupon' ? <Tag size={20}/> : <Gift size={20}/>}
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{reward.name}</p>
                                    <p className="text-xs text-gray-500">{reward.type === 'coupon' ? 'คูปอง' : 'สินค้า'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xl font-bold text-yellow-600 flex items-center gap-1">
                                    {reward.cost.toLocaleString()} <Coins size={16} fill="currentColor" className="text-yellow-400"/>
                                </span>
                                <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full"><Edit size={16}/></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};




// ======= Expense ======
// --- HELPER COMPONENTS FOR EXPENSE ---
//=======================================

const PinModal = ({ isOpen, onClose, onSuccess }) => {
    const [pin, setPin] = useState('');
    useEffect(() => { if (!isOpen) setPin(''); }, [isOpen]);

    const handleNum = (num) => { if (pin.length < 6) setPin(prev => prev + num); };
    const handleBackspace = () => setPin(prev => prev.slice(0, -1));
    const handleClear = () => setPin('');
    const handleSubmit = () => {
        // ใช้ 123456 ตาม Default หรือตาม System Settings
        if (pin === '123456' || pin === SYSTEM_DEFAULTS.adminPin) { onSuccess(); onClose(); } 
        else { alert('รหัส PIN ไม่ถูกต้อง (Default: 123456)'); setPin(''); }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-[340px] shadow-2xl border border-gray-200">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3"><Lock size={32} /></div>
                    <h3 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ยืนยันรหัสความปลอดภัย</h3>
                    <p className="text-gray-500 text-sm">กรุณาระบุ PIN เพื่อบันทึกรายการ</p>
                </div>
                <div className="flex justify-center gap-3 mb-8">
                    {[...Array(6)].map((_, i) => ( <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 ${i < pin.length ? 'bg-blue-600 scale-110' : 'bg-gray-200'}`} /> ))}
                </div>
                <div className="grid grid-cols-3 gap-4 mb-6">
                    {[1,2,3,4,5,6,7,8,9].map(n => ( <button key={n} onClick={() => handleNum(n)} className="h-16 rounded-2xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-white hover:shadow-md transition-all active:scale-95">{n}</button> ))}
                    <button onClick={handleClear} className="h-16 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 transition-all active:scale-95">C</button>
                    <button onClick={() => handleNum(0)} className="h-16 rounded-2xl bg-gray-50 text-2xl font-bold text-gray-700 hover:bg-white hover:shadow-md transition-all active:scale-95">0</button>
                    <button onClick={handleBackspace} className="h-16 rounded-2xl bg-gray-50 text-gray-500 flex items-center justify-center hover:bg-gray-200 transition-all active:scale-95"><ChevronLeft size={28}/></button> 
                </div>
                <div className="flex gap-3">
                   <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition">ยกเลิก</button>
                   <button onClick={handleSubmit} disabled={pin.length !== 6} className="flex-1 py-3 rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-200 disabled:opacity-50 disabled:shadow-none transition">ยืนยัน</button>
                </div>
            </div>
        </div>
    );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-3xl p-6 w-[340px] shadow-2xl border border-gray-200 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3"><Ban size={32} /></div>
                <h3 className={`${FONTS.header} text-xl font-bold text-gray-800 mb-2`}>{title}</h3>
                <p className="text-gray-500 text-sm mb-6">{message}</p>
                <div className="flex gap-3">
                   <button onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 font-bold text-gray-600 hover:bg-gray-200 transition">ปิดหน้าต่าง</button>
                   <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 shadow-lg shadow-red-200 transition">ยืนยันการยกเลิก</button>
                </div>
            </div>
        </div>
    );
};

// --- 4. EXPENSE MODULE (FULL) ---
const ExpenseModule = ({ onNavigate, onOpenDrawer }) => {
    // State
    const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('ทั้งหมด');
    const [dateRange, setDateRange] = useState({ start: null, end: null, step: 0 }); 
    const [activeExpense, setActiveExpense] = useState(null);
    
    // UI State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showPinModal, setShowPinModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelTargetId, setCancelTargetId] = useState(null);
    const [errorFields, setErrorFields] = useState([]);
    const fileInputRef = useRef(null);

    // Form Data
    const [formData, setFormData] = useState({
        id: '', amount: '', title: '', category: '', date: new Date().toISOString().split('T')[0], note: '', receiptImage: null
    });

    // ✅ Define Menu Items INSIDE component to access onNavigate
    const menuItems = [
        { icon: Menu, label: 'เมนูหลัก', id: 'nav_home', action: () => onOpenDrawer() },
        { icon: Receipt, label: 'รายการค่าใช้จ่าย', id: 'list', active: true },
        { icon: LogOut, label: 'กลับหน้า Home', bottom: true, action: () => onNavigate('home') }
    ];

    // --- Computed & Actions ---
    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ทั้งหมด' || exp.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const handleCreateClick = () => {
        setActiveExpense(null); setIsEditing(false); setErrorFields([]);
        setFormData({ id: `EXP-${String(expenses.length + 1).padStart(3, '0')}`, amount: '', title: '', category: '', date: new Date().toISOString().split('T')[0], note: '', receiptImage: null });
        setIsFormOpen(true);
    };

    const handleEditClick = (expense) => {
        setIsEditing(true); setErrorFields([]);
        setFormData({ id: expense.id, amount: expense.amount, title: expense.title, category: expense.category, date: expense.date, note: expense.note || '', receiptImage: expense.receiptImage || null });
        setIsFormOpen(true);
    };

    const handleCancelClick = (id) => { setCancelTargetId(id); setShowCancelModal(true); };
    
    const handleConfirmCancel = () => {
        if (cancelTargetId) {
            const now = new Date().toLocaleString('th-TH');
            setExpenses(prev => prev.map(e => e.id === cancelTargetId ? { ...e, status: 'ยกเลิก', cancelledBy: 'Admin', cancelledAt: now } : e));
            if (activeExpense && activeExpense.id === cancelTargetId) setActiveExpense(prev => ({ ...prev, status: 'ยกเลิก', cancelledBy: 'Admin', cancelledAt: now }));
        }
        setShowCancelModal(false); setCancelTargetId(null);
    };

    const handleSaveRequest = () => {
        const errors = [];
        if (!formData.amount) errors.push('amount');
        if (!formData.title) errors.push('title');
        if (!formData.category) errors.push('category');
        if (errors.length > 0) { setErrorFields(errors); setTimeout(() => setErrorFields([]), 800); return; }
        setShowPinModal(true);
    };

    const handlePinSuccess = () => {
        const newData = { ...formData, amount: Number(formData.amount) };
        if (isEditing) {
            setExpenses(prev => prev.map(e => e.id === formData.id ? { ...e, ...newData } : e));
            if (activeExpense && activeExpense.id === formData.id) setActiveExpense({ ...activeExpense, ...newData });
        } else {
            const newEntry = { ...newData, id: `EXP-${Date.now().toString().slice(-4)}`, status: 'สำเร็จ', createdBy: 'Admin', createdAt: new Date().toLocaleString('th-TH') };
            setExpenses(prev => [newEntry, ...prev]);
        }
        setIsFormOpen(false); setIsEditing(false);
    };

    const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setFormData({...formData, receiptImage: file.name}); };
    
    const handleDateClick = () => {
        const today = new Date().toISOString().split('T')[0];
        if (dateRange.step === 0) setDateRange({ start: today, end: null, step: 1 });
        else if (dateRange.step === 1) setDateRange({ ...dateRange, end: today, step: 2 });
        else setDateRange({ start: null, end: null, step: 0 });
    };
    
    const getErrorClass = (field) => errorFields.includes(field) ? 'border-red-500 animate-flash-error' : 'border-gray-200';

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
            <BaseSidebarLayout menuItems={menuItems} activePage="list" onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />
            
            <div className="flex-1 flex overflow-hidden relative">
                <PinModal isOpen={showPinModal} onClose={() => setShowPinModal(false)} onSuccess={handlePinSuccess} />
                <ConfirmModal isOpen={showCancelModal} onClose={() => setShowCancelModal(false)} onConfirm={handleConfirmCancel} title="ยืนยันการยกเลิกรายการ" message="คุณต้องการเปลี่ยนสถานะรายการนี้เป็น 'ยกเลิก' ใช่หรือไม่?" />

                {/* Left Panel: List */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col z-10 shadow-sm">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className={`${FONTS.header} text-xl font-bold text-gray-800 mb-3`}>บันทึกค่าใช้จ่าย</h2>
                        <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                            <input type="text" placeholder="ค้นหารายการ..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-100 outline-none" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                        </div>
                        <div className="flex p-1 bg-gray-100 rounded-lg mb-2">
                            {['ทั้งหมด', 'สำเร็จ', 'ยกเลิก'].map(status => (
                                <button key={status} onClick={() => setFilterStatus(status)} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === status ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{status}</button>
                            ))}
                        </div>
                        <div onClick={handleDateClick} className={`cursor-pointer p-2 rounded-lg border text-sm flex justify-between items-center ${dateRange.step > 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                            <div className="flex items-center gap-2"><CalendarIcon size={16}/> <span>{dateRange.start ? `${dateRange.start} ${dateRange.end ? '- ' + dateRange.end : '...'}` : 'เลือกช่วงวันที่'}</span></div>
                            {dateRange.step > 0 && <X size={14} onClick={(e)=>{e.stopPropagation(); setDateRange({start:null,end:null,step:0})}}/>}
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                        {filteredExpenses.length === 0 ? <div className="text-center py-10 text-gray-400 text-sm">ไม่พบรายการในหมวดนี้</div> : filteredExpenses.map(exp => (
                            <div key={exp.id} onClick={() => { setActiveExpense(exp); setIsFormOpen(false); }} className={`p-3 rounded-xl border cursor-pointer transition ${activeExpense?.id === exp.id ? 'border-green-500 bg-green-50 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}>
                                <div className="flex justify-between mb-1"><span className="font-bold text-gray-800 text-sm">{exp.title}</span><span className={`text-xs px-2 py-0.5 rounded-full ${exp.status==='สำเร็จ'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{exp.status}</span></div>
                                <div className="flex justify-between text-xs text-gray-500"><span>{exp.date}</span><span className="font-bold text-gray-800">฿{exp.amount.toLocaleString()}</span></div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-gray-200 mt-auto bg-gray-50">
                        <button onClick={handleCreateClick} className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-black transition flex items-center justify-center gap-2"><Plus size={18} /> สร้างบันทึกใหม่</button>
                    </div>
                </div>

                {/* Right Panel: Detail & Form */}
                <div className="flex-1 bg-[#F9FAFB] flex flex-col">
                    {isFormOpen ? (
                        <div className="p-4 md:p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                                <div className={`${isEditing ? 'bg-blue-600' : 'bg-gray-900'} px-6 py-4 flex justify-between items-center text-white`}>
                                    <h2 className="text-lg font-bold flex items-center gap-2">{isEditing ? <Edit size={20}/> : <Plus size={20}/>} {isEditing ? 'แก้ไขรายการ' : 'บันทึกค่าใช้จ่ายใหม่'}</h2>
                                    <button onClick={() => setIsFormOpen(false)} className="text-white/70 hover:text-white"><X size={20}/></button>
                                </div>
                                <div className="p-6 md:p-8 space-y-6">
                                    <div className="text-center">
                                        <label className={`text-gray-500 text-sm font-medium mb-2 block ${errorFields.includes('amount') ? 'text-red-500' : ''}`}>ระบุจำนวนเงิน *</label>
                                        <div className="relative inline-block w-full max-w-sm"><span className="absolute left-4 top-1/2 -translate-y-1/2 text-3xl font-bold text-gray-400">฿</span><input type="number" placeholder="0.00" autoFocus className={`w-full pl-12 pr-4 py-3 text-4xl font-bold text-gray-800 bg-gray-50 border-b-2 focus:outline-none focus:bg-white transition text-center ${errorFields.includes('amount') ? 'border-red-500 bg-red-50 animate-flash-error' : 'border-green-500'}`} value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} /></div>
                                    </div>
                                    <div className={`p-4 rounded-xl border ${errorFields.includes('category') ? 'border-red-500 bg-red-50 animate-flash-error' : 'border-transparent'}`}>
                                        <label className="text-gray-500 text-sm font-medium mb-3 block">เลือกหมวดหมู่ *</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">{EXPENSE_CATEGORIES.map(cat => (<div key={cat.id} onClick={() => setFormData({...formData, category: cat.label})} className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${formData.category === cat.label ? `${cat.color} border-current shadow-sm ring-1 ring-offset-1` : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}><div className={`w-8 h-8 rounded-lg flex items-center justify-center ${formData.category === cat.label ? 'bg-white/50' : 'bg-gray-100'}`}><cat.icon size={16}/></div><span className="font-medium text-sm">{cat.label}</span></div>))}</div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1"><label className="text-gray-500 text-sm font-medium">ชื่อรายการ *</label><input type="text" placeholder="เช่น จ่ายค่าไฟเดือน มิ.ย." className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none ${getErrorClass('title')}`} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} /></div>
                                        <div className="space-y-1"><label className="text-gray-500 text-sm font-medium">วันที่ทำรายการ</label><input type="date" className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-1"><label className="text-gray-500 text-sm font-medium">หมายเหตุ</label><textarea rows="3" placeholder="รายละเอียดเพิ่มเติม..." className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 outline-none resize-none" value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})}></textarea></div>
                                        <div className="w-32 shrink-0 space-y-1"><label className="text-gray-500 text-sm font-medium">รูปใบเสร็จ</label><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} /><div onClick={() => fileInputRef.current.click()} className={`w-full h-[98px] border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition relative overflow-hidden ${formData.receiptImage ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'}`}>{formData.receiptImage ? (<div className="text-center p-2"><CheckCircle size={24} className="text-green-600 mx-auto mb-1"/><span className="text-xs text-green-700 break-all line-clamp-2">{formData.receiptImage}</span></div>) : (<><Camera size={24} className="text-gray-400 mb-1"/><span className="text-xs text-gray-400">อัพโหลด</span></>)}</div></div>
                                    </div>
                                    <div className="pt-4 flex gap-3 border-t border-gray-100">
                                        <button onClick={() => setIsFormOpen(false)} className="flex-1 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition">ยกเลิก</button>
                                        <button onClick={handleSaveRequest} className={`flex-1 py-3 text-white font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2 ${isEditing ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}`}><Save size={18}/> {isEditing ? 'ยืนยันการแก้ไข' : 'บันทึกรายการ'}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeExpense ? (
                        <div className="p-8 max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-right-4">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative">
                                <div className="absolute top-4 right-4 text-gray-300 pointer-events-none"><Receipt size={100} strokeWidth={0.5} opacity={0.1}/></div>
                                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                    <div><h1 className="text-2xl font-bold text-gray-800">{activeExpense.title}</h1><p className="text-gray-500 text-sm font-mono mt-1">Ref: {activeExpense.id}</p></div>
                                    <div className="text-right"><span className="block text-3xl font-bold text-green-600">฿{activeExpense.amount.toLocaleString()}</span><span className={`text-xs px-2 py-0.5 rounded-full inline-block mt-1 ${activeExpense.status==='สำเร็จ'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{activeExpense.status}</span></div>
                                </div>
                               
                                <div className="grid grid-cols-2 gap-6 text-sm mb-6">
                                    <div><label className="text-gray-400 block mb-1">วันที่ทำรายการ</label><p className="font-medium text-lg">{activeExpense.date}</p></div>
                                    <div><label className="text-gray-400 block mb-1">หมวดหมู่</label><p className="font-medium bg-gray-100 px-3 py-1 rounded-lg inline-block text-gray-700">{activeExpense.category}</p></div>
                                    <div className="col-span-2"><label className="text-gray-400 block mb-1">หมายเหตุ</label><p className="font-medium text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{activeExpense.note || '-'}</p></div>
                                    {activeExpense.receiptImage && (<div className="col-span-2"><label className="text-gray-400 block mb-1">ไฟล์แนบ</label><div className="flex items-center gap-2 p-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 w-fit"><ImageIcon size={16}/><span>{activeExpense.receiptImage}</span></div></div>)}
                                </div>
               
                                <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-col gap-1">
                                    <p>สร้างโดย: <span className="text-gray-600">{activeExpense.createdBy || '-'}</span> เมื่อ {activeExpense.createdAt || '-'}</p>
                                    {activeExpense.status === 'ยกเลิก' && (<p className="text-red-400">ยกเลิกโดย: <span className="font-semibold">{activeExpense.cancelledBy}</span> เมื่อ {activeExpense.cancelledAt}</p>)}
                                </div>
                   
                                <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-gray-100">
                                    {activeExpense.status !== 'ยกเลิก' && (<button onClick={() => handleCancelClick(activeExpense.id)} className="px-5 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl hover:bg-red-100 font-bold flex items-center gap-2 transition"><Ban size={18}/> ยกเลิกเอกสาร</button>)}
                                    <button onClick={() => handleEditClick(activeExpense)} className="px-5 py-2 bg-white text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50 font-bold flex items-center gap-2 shadow-sm transition"><Edit2 size={18}/> แก้ไข</button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-300">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6"><Receipt size={48} className="text-gray-400"/></div>
                            <p className="text-lg font-medium text-gray-500">เลือกรายการเพื่อดูรายละเอียด</p>
                            <p className="text-sm">หรือกดปุ่ม "สร้างบันทึกใหม่" ที่มุมซ้ายล่าง</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ZONE E (Part 4): SETTING 
const SettingsView = ({ settings, setSettings, onBack }) => {
    const [activeTab, setActiveTab] = useState('sales');

    const SettingSection = ({ title, children }) => (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className={`${FONTS.header} text-lg font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2`}>{title}</h3>
            <div className="space-y-4">{children}</div>
        </div>
    );

    const Toggle = ({ label, checked, onChange }) => (
        <div className="flex justify-between items-center">
            <span className="text-gray-700 font-medium">{label}</span>
            <div onClick={() => onChange(!checked)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${checked ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );

    const InputRow = ({ label, value, onChange, type = 'text', suffix }) => (
        <div className="flex justify-between items-center">
             <span className="text-gray-700 font-medium">{label}</span>
             <div className="flex items-center gap-2">
                 <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="text-right border border-gray-200 rounded-lg px-3 py-1.5 w-32 focus:border-emerald-500 outline-none" />
                 {suffix && <span className="text-gray-400 text-sm">{suffix}</span>}
             </div>
        </div>
    );

    const SelectRow = ({ label, value, onChange, options }) => (
        <div className="flex justify-between items-center">
             <span className="text-gray-700 font-medium">{label}</span>
             <select value={value} onChange={(e) => onChange(e.target.value)} className="text-right border border-gray-200 rounded-lg px-3 py-1.5 bg-white outline-none">
                 {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
             </select>
        </div>
    );

    return (
        <div className="h-screen bg-[#F9FAFB] flex flex-col">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full"><ArrowLeft className="text-gray-600" /></button>
                <h1 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ตั้งค่าร้านค้า (Store Settings)</h1>
            </header>
            
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 gap-2">
                    {[
                        { id: 'sales', label: 'การขาย & การเงิน', icon: CreditCard },
                        { id: 'system', label: 'ระบบ & ธีม', icon: Settings },
                        { id: 'channels', label: 'ช่องทางขาย', icon: Globe },
                        { id: 'notif', label: 'การแจ้งเตือน', icon: Bell },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition ${activeTab === tab.id ? 'bg-emerald-50 text-emerald-600' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <tab.icon size={18} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="max-w-2xl mx-auto">
                        {activeTab === 'sales' && (
                            <SettingSection title="การจัดการรูปแบบการขาย">
                                <SelectRow label="รูปแบบการขายหลัก" value={settings.salesMode} onChange={v => setSettings({...settings, salesMode: v})} options={[{value:'retail', label:'ปลีก (Retail)'}, {value:'wholesale', label:'ส่ง (Wholesale)'}, {value:'mixed', label:'ผสม (Mixed)'}]} />
                                <InputRow label="อัตราภาษี (VAT)" value={settings.taxRate} onChange={v => setSettings({...settings, taxRate: parseFloat(v)})} type="number" suffix="%" />
                                <SelectRow label="การปัดเศษทศนิยม" value={settings.rounding} onChange={v => setSettings({...settings, rounding: v})} options={[{value:'floor', label:'ปัดลง (Floor)'}, {value:'round', label:'ปัดตามหลัก (Round)'}, {value:'ceil', label:'ปัดขึ้น (Ceil)'}, {value:'none', label:'ไม่ปัด (None)'}]} />
                                <InputRow label="เวลาเริ่มรอบการขาย" value={settings.shiftStart} onChange={v => setSettings({...settings, shiftStart: v})} type="time" />
                            </SettingSection>
                        )}

                        {activeTab === 'system' && (
                            <SettingSection title="การแสดงผล & ระบบ">
                                <SelectRow label="ธีมแอพพลิเคชั่น" value={settings.theme} onChange={v => setSettings({...settings, theme: v})} options={[{value:'dark', label:'Dark Mode'}, {value:'light', label:'Light Mode'}, {value:'system', label:'System Default'}]} />
                                <div className="border-t border-gray-100 my-2"></div>
                                <InputRow label="ระดับเสียงเพลงในร้าน (IoT)" value={settings.musicVolume} onChange={v => setSettings({...settings, musicVolume: parseInt(v)})} type="range" suffix={`${settings.musicVolume}%`} />
                            </SettingSection>
                        )}

                        {activeTab === 'channels' && (
                            <SettingSection title="ช่องทางการขายออนไลน์">
                                <Toggle label="Line Shopping / Line OA" checked={settings.onlineChannels.line} onChange={v => setSettings({...settings, onlineChannels: {...settings.onlineChannels, line: v}})} />
                                <Toggle label="Shopee Integration" checked={settings.onlineChannels.shopee} onChange={v => setSettings({...settings, onlineChannels: {...settings.onlineChannels, shopee: v}})} />
                                <Toggle label="Lazada Integration" checked={settings.onlineChannels.lazada} onChange={v => setSettings({...settings, onlineChannels: {...settings.onlineChannels, lazada: v}})} />
                                <Toggle label="TikTok Shop" checked={settings.onlineChannels.tiktok} onChange={v => setSettings({...settings, onlineChannels: {...settings.onlineChannels, tiktok: v}})} />
                            </SettingSection>
                        )}

                        {activeTab === 'notif' && (
                            <SettingSection title="การตั้งค่าการแจ้งเตือน">
                                <Toggle label="แจ้งเตือนสต็อกใกล้หมด" checked={settings.notifications.stock} onChange={v => setSettings({...settings, notifications: {...settings.notifications, stock: v}})} />
                                <Toggle label="แจ้งเตือนเปิด/ปิดกะ" checked={settings.notifications.shift} onChange={v => setSettings({...settings, notifications: {...settings.notifications, shift: v}})} />
                                <Toggle label="เสียงแจ้งเตือน (Sound)" checked={settings.notifications.sound} onChange={v => setSettings({...settings, notifications: {...settings.notifications, sound: v}})} />
                            </SettingSection>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
// --- 5. SETTINGS MODULE ---

// ==========================================
	// --- Channel Helper Component ---
const ChannelRow = ({ icon: Icon, title, desc, channelKey, color, bgColor, connectedChannels, toggleChannel }) => {
    const isConnected = connectedChannels[channelKey];
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isConnected ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${isConnected ? bgColor : 'bg-gray-200'} ${isConnected ? color : 'text-gray-400'}`}>
                    <Icon size={24} />
                </div>
                <div>
                    <h4 className={`font-bold text-base ${isConnected ? 'text-gray-800' : 'text-gray-500'}`}>{title}</h4>
                    <p className="text-xs text-gray-500">{desc}</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-md ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                    {isConnected ? 'Connected' : 'Offline'}
                </span>
                <div onClick={() => toggleChannel(channelKey)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isConnected ? 'bg-emerald-500' : 'bg-gray-300'}`} >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isConnected ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
            </div>
        </div>
    );
};

const INITIAL_CHANNELS_STATE = {
  popupLocal: true,
  petsZoo: false,
  facebook: true,
  instagram: false,
  tiktok: false,
  shopee: true,
  lazada: false
};
         

const SettingsModule = ({ onNavigate, onOpenDrawer, currentTheme, onChangeTheme }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const fileInputRef = useRef(null);

// ✅ NEW: อัปเดต State ให้รองรับ Timezone และ Theme Schedule
    const [systemSettings, setSystemSettings] = useState({
        language: 'th',
        dateFormat: 'DD/MM/YYYY',
        currency: 'THB',
        timezone: 'Asia/Bangkok', // เพิ่ม Timezone
        soundEffects: true,
        autoLock: 5,
        enableCDS: true,
        cdsContent: 'slideshow',
        cdsBrightness: 80,
        // เพิ่มตั้งค่าเวลาธีม
        autoTheme: false,     // เปิด/ปิด การเปลี่ยนธีมอัตโนมัติ
        themeStartTime: '18:00', // เวลาเริ่มธีมกลางคืน
        themeEndTime: '06:00',   // เวลาจบ (กลับเป็นธีมปกติ)
        nightTheme: 'luxury'     // ธีมที่จะใช้ตอนกลางคืน
    });
	
	const [connectedChannels, setConnectedChannels] = useState(INITIAL_CHANNELS_STATE);

    const toggleChannel = (key) => {
        setConnectedChannels(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

// Helper Component สำหรับ Channel (อัปเกรดให้กดได้จริง)
    const ChannelRow = ({ icon: Icon, title, desc, channelKey, color, bgColor }) => {
        const isConnected = connectedChannels[channelKey];
        return (
            <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isConnected ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${isConnected ? bgColor : 'bg-gray-200'} ${isConnected ? color : 'text-gray-400'}`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h4 className={`font-bold text-base ${isConnected ? 'text-gray-800' : 'text-gray-500'}`}>{title}</h4>
                        <p className="text-xs text-gray-500">{desc}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${isConnected ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                        {isConnected ? 'Connected' : 'Offline'}
                    </span>
                    <div 
                        onClick={() => toggleChannel(channelKey)}
                        className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${isConnected ? 'bg-emerald-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isConnected ? 'translate-x-6' : 'translate-x-0'}`}></div>
                    </div>
                </div>
            </div>
        );
    };
    // --- State for General Tab ---
    const [generalForm, setGeneralForm] = useState({
        shopName: '',
        shopCode: 'SHOP-8829-XJ', // Platform Gen
        branch: '',
        branchCode: '',
        managerName: '',
        managerIdCard: '',
        entityType: 'ร้านค้า', // Default changed
        entityName: '',
        
        // Main Address
        zipcode: '', province: '', district: '', subDistrict: '', addressDetail: '',
        
        // Shipping Address
        shippingAddressType: 'same', // same, custom
        shippingZipcode: '', shippingProvince: '', shippingDistrict: '', shippingSubDistrict: '', shippingAddressDetail: '',
        
        // Doc Address
        docAddressType: 'same', // same, custom
        docZipcode: '', docProvince: '', docDistrict: '', docSubDistrict: '', docAddressDetail: '',

        aboutUs: '',
        contacts: {
            line: '', wechat: '', whatsapp: '', lazada: '', shopee: '', instagram: '', facebook: '', tiktok: ''
        }
    });

    // --- State for Sales Tab ---
    const [salesForm, setSalesForm] = useState({
        vatEnabled: true,
        vatRate: 7,
        roundingMode: 'universal', // universal, up, down
        xenditEnabled: true,
        xenditNotify: true,
        // Operating Hours
        operatingHours: [
            { day: 'จันทร์', open: true, start: '09:00', end: '18:00' },
            { day: 'อังคาร', open: true, start: '09:00', end: '18:00' },
            { day: 'พุธ', open: true, start: '09:00', end: '18:00' },
            { day: 'พฤหัสบดี', open: true, start: '09:00', end: '18:00' },
            { day: 'ศุกร์', open: true, start: '09:00', end: '18:00' },
            { day: 'เสาร์', open: true, start: '10:00', end: '20:00' },
            { day: 'อาทิตย์', open: false, start: '10:00', end: '20:00' },
        ]
    });

    // --- State for Stock Tab ---
    const [stockForm, setStockForm] = useState({
        costingMethod: 'fifo', // fifo, lifo, average
        allowNegativeStock: false,
        lowStockAlert: true,
        lowStockThreshold: 5,
        enableBatchTracking: false,
        enableExpiryTracking: true,
        enableSerialTracking: false,
        autoGenPO: false,
        forceAuditSchedule: false,
        auditPeriod: 30 // Default 30 days
    });

    // --- State for Printer Settings Tab ---
    const [printerForm, setPrinterForm] = useState({
        // Document Header Info (80mm)
        billHeaderName: 'Pet Omni Store',
        billAddress: '123 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110',
        taxId: '0105551234567',
        
        // Enabled Document Types
        enableDeliveryNote: true,
        enableReceipt: true,
        enableTaxInvoice: true,

        // Printer Devices
        printers: [
            { id: 1, name: 'Cashier Counter 1 (XP-80C)', type: 'Thermal 80mm', conn: 'USB', active: true },
            { id: 2, name: 'Warehouse Label (Zebra)', type: 'Label Sticker', conn: 'LAN', active: false },
            { id: 3, name: 'Office Main (Brother)', type: 'A4 Document', conn: 'WiFi', active: true },
        ]
    });

    // Printer Discovery State
    const [showDiscoveryModal, setShowDiscoveryModal] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [draftPrinter, setDraftPrinter] = useState(null);

    const MOCK_DISCOVERED = [
        { id: 'd1', model: 'Epson TM-T82X', type: 'Thermal 80mm', conn: 'USB', ip: '' },
        { id: 'd2', model: 'Xprinter XP-N160II', type: 'Thermal 80mm', conn: 'WiFi', ip: '192.168.1.150' },
        { id: 'd3', model: 'Pantum P2500W', type: 'A4 Document', conn: 'WiFi', ip: '192.168.1.102' },
    ];

    // Helper to generate doc title based on checkboxes
    const getPreviewDocTitle = () => {
        const types = [];
        if (printerForm.enableReceipt) types.push('ใบเสร็จรับเงิน');
        if (printerForm.enableTaxInvoice) types.push('ใบกำกับภาษีอย่างย่อ');
        if (printerForm.enableDeliveryNote) types.push('ใบส่งของ');
        
        if (types.length === 0) return '(ไม่ได้เลือกประเภทเอกสาร)';
        return types.join(' / ');
    };

    // --- State for Smart Hours Input ---
    const [tempStartTime, setTempStartTime] = useState('09:00');
    const [tempEndTime, setTempEndTime] = useState('18:00');
    const [tempSelectedDays, setTempSelectedDays] = useState([0,1,2,3,4,5,6]); // All indices selected by default
    const DAYS_SHORT = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];

    const handleApplyHours = () => {
        const newHours = [...salesForm.operatingHours];
        tempSelectedDays.forEach(dayIndex => {
            newHours[dayIndex].open = true;
            newHours[dayIndex].start = tempStartTime;
            newHours[dayIndex].end = tempEndTime;
        });
        setSalesForm(prev => ({...prev, operatingHours: newHours}));
        alert('อัปเดตเวลาทำการเรียบร้อยแล้ว!');
    };

    const toggleDaySelection = (index) => {
        if(tempSelectedDays.includes(index)) {
            setTempSelectedDays(tempSelectedDays.filter(d => d !== index));
        } else {
            setTempSelectedDays([...tempSelectedDays, index].sort());
        }
    };

    // Logo & Images State
    const [logoShape, setLogoShape] = useState('circle');
    const [logoImage, setLogoImage] = useState(null);
    const [bgImages, setBgImages] = useState([null, null, null, null]);

    // Tags State
    const [selectedTags, setSelectedTags] = useState([]);
    const [customTag, setCustomTag] = useState('');
    
    // Address Search State
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [activeZipField, setActiveZipField] = useState(null); // 'main', 'shipping', 'doc'

    const PRESET_TAGS = [
        "อาหารสัตว์เลี้ยง", "อุปกรณ์สัตว์เลี้ยง", "อาบน้ำ", "ตัดขน", "ยาสัตว์เลี้ยง", 
        "คลีนิค", "รับฝาก", "รพ.สัตว์", "ฝึกสุนัข", "สระน้ำ",
        "คาเฟ่แมว", "สัตว์แปลก (Exotic)", "แท็กซี่สัตว์เลี้ยง", "โรงแรมสัตว์เลี้ยง", "จัดเลี้ยง"
    ];

    // Mock Address Lookup
    const handleZipcodeChange = (value, fieldType) => {
        // fieldType: 'main', 'shipping', 'doc'
        const keyMap = {
            'main': 'zipcode',
            'shipping': 'shippingZipcode',
            'doc': 'docZipcode'
        };
        
        setGeneralForm(prev => ({ ...prev, [keyMap[fieldType]]: value }));
        
        if (value.length > 2) {
            const matches = THAI_ADDRESS_MOCK.filter(a => a.postcode.startsWith(value));
            setAddressSuggestions(matches);
            setActiveZipField(fieldType);
        } else {
            setActiveZipField(null);
        }
    };

    const selectAddress = (addr) => {
        if (!activeZipField) return;

        let updates = {};
        if (activeZipField === 'main') {
            updates = { zipcode: addr.postcode, province: addr.province, district: addr.district, subDistrict: addr.subDistrict[0] };
        } else if (activeZipField === 'shipping') {
            updates = { shippingZipcode: addr.postcode, shippingProvince: addr.province, shippingDistrict: addr.district, shippingSubDistrict: addr.subDistrict[0] };
        } else if (activeZipField === 'doc') {
            updates = { docZipcode: addr.postcode, docProvince: addr.province, docDistrict: addr.district, docSubDistrict: addr.subDistrict[0] };
        }

        setGeneralForm(prev => ({ ...prev, ...updates }));
        setActiveZipField(null);
    };

    const handleSave = () => {
        setShowPasswordModal(true);
    };

    const confirmSave = () => {
        if (passwordInput === '1234') {
            alert('บันทึกข้อมูลเรียบร้อย!');
            setShowPasswordModal(false);
            setPasswordInput('');
        } else {
            alert('รหัสผ่านไม่ถูกต้อง (ลองใช้ 1234)');
        }
    };

    const generateAboutUs = () => {
        const shop = generalForm.shopName || 'ร้านของเรา';
        const tag1 = selectedTags[0] || 'สินค้าสัตว์เลี้ยง';
        const tag2 = selectedTags[1] || 'บริการครบวงจร';
        const dist = generalForm.district || 'เมือง';
        const contact = generalForm.contacts.line ? `Line: ${generalForm.contacts.line}` : (generalForm.contacts.facebook ? `FB: ${generalForm.contacts.facebook}` : 'เรา');

        const text = `ยินดีต้อนรับสู่ ${shop} แดนสวรรค์สัตว์เลี้ยง\nบริการครบจบที่เดียว ทั้ง ${tag1} และ ${tag2} อย่างเซียน\nตั้งอยู่ที่ ${dist} เดินทางง่าย แวะมาเยี่ยมเยียน\nติดต่อ ${contact} ได้เลย พร้อมดูแลดั่งคนกันเอง`;
        
        setGeneralForm(prev => ({ ...prev, aboutUs: text }));
    };

    const toggleTag = (tag) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleLogoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
        if(e.target.files && e.target.files[0]) {
             alert(`เลือกไฟล์: ${e.target.files[0].name}`);
        }
    };

    const handleHoursChange = (idx, field, value) => {
        const newHours = [...salesForm.operatingHours];
        newHours[idx][field] = value;
        setSalesForm(prev => ({...prev, operatingHours: newHours}));
    };

    // Printer Functions
    const togglePrinter = (id) => {
        setPrinterForm(prev => ({
            ...prev,
            printers: prev.printers.map(p => p.id === id ? { ...p, active: !p.active } : p)
        }));
    };

    const handleAddClick = () => {
        setShowDiscoveryModal(true);
    };

    const handleSelectForConfig = (printer) => {
        setDraftPrinter({
            ...printer,
            customName: printer.model, // Default name
            paperSize: printer.type.includes('80mm') ? '80mm' : (printer.type.includes('A4') ? 'A4' : '58mm')
        });
        setShowDiscoveryModal(false);
        setShowConfigModal(true);
    };

    const handleSavePrinterConfig = () => {
        if (!draftPrinter) return;
        
        const newPrinter = {
            id: Date.now(),
            name: draftPrinter.customName,
            type: draftPrinter.type,
            conn: draftPrinter.conn,
            active: true
        };
        
        setPrinterForm(prev => ({
            ...prev,
            printers: [...prev.printers, newPrinter]
        }));
        
        setShowConfigModal(false);
        setDraftPrinter(null);
    };

    // Components
    const LogoShapeSelector = () => (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur p-2 rounded-full shadow-lg z-20">
            <button onClick={(e) => {e.stopPropagation(); setLogoShape('circle')}} className={`w-8 h-8 rounded-full border-2 ${logoShape==='circle'?'border-emerald-500 bg-emerald-100':'border-gray-300'}`}></button>
            <button onClick={(e) => {e.stopPropagation(); setLogoShape('rounded-square')}} className={`w-8 h-8 rounded-2xl border-2 ${logoShape==='rounded-square'?'border-emerald-500 bg-emerald-100':'border-gray-300'}`}></button>
            <button onClick={(e) => {e.stopPropagation(); setLogoShape('rounded-rect')}} className={`w-12 h-8 rounded-xl border-2 ${logoShape==='rounded-rect'?'border-emerald-500 bg-emerald-100':'border-gray-300'}`}></button>
        </div>
    );

    const menuItems = [
        { icon: Menu, label: 'เมนูหลัก', id: 'nav_home', action: () => onNavigate('home') },
        { icon: Settings, label: 'ทั่วไป', id: 'general', action: () => setActiveTab('general') },
        { icon: Store, label: 'การขาย', id: 'sales', action: () => setActiveTab('sales') },
        { icon: Package, label: 'ระบบสต็อก', id: 'stock_sys', action: () => setActiveTab('stock_sys') },
        { icon: Printer, label: 'เครื่องพิมพ์', id: 'printer', action: () => setActiveTab('printer') },
        { icon: LayoutDashboard, label: 'จอภาพ & ระบบ', id: 'system', action: () => setActiveTab('system') },
        { icon: Globe, label: 'ออนไลน์', id: 'channels', action: () => setActiveTab('channels') },
        { icon: Bell, label: 'การแจ้งเตือน', id: 'notif', action: () => setActiveTab('notif') },
        { icon: LogOut, label: 'กลับหน้า Home', bottom: true }
    ];

    const FullAddressForm = ({ prefix, label, formType }) => {
        // Helper to get value based on prefix (e.g. shippingZipcode vs zipcode)
        const getVal = (suffix) => prefix ? generalForm[`${prefix}${suffix}`] : generalForm[suffix.toLowerCase()];
        // Exception: generalForm uses lowercase 'zipcode' etc for main, but 'shippingZipcode' for others.
        // Let's map manually for safety
        const zip = prefix ? generalForm[`${prefix}Zipcode`] : generalForm.zipcode;
        const prov = prefix ? generalForm[`${prefix}Province`] : generalForm.province;
        const dist = prefix ? generalForm[`${prefix}District`] : generalForm.district;
        const sub = prefix ? generalForm[`${prefix}SubDistrict`] : generalForm.subDistrict;
        const detail = prefix ? generalForm[`${prefix}AddressDetail`] : generalForm.addressDetail;

        const setDetail = (val) => {
            const key = prefix ? `${prefix}AddressDetail` : 'addressDetail';
            setGeneralForm(prev => ({...prev, [key]: val}));
        };

        return (
            <div className={`rounded-xl border border-gray-200 mb-6 relative ${prefix ? 'bg-white mt-3 p-4' : 'bg-gray-50 p-6'}`}>
                {label && <h4 className="font-bold text-gray-700 mb-4 border-b pb-2">{label}</h4>}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 relative">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1 font-bold">รหัสไปรษณีย์</label>
                        <input 
                            type="text" 
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-center font-bold text-emerald-700"
                            placeholder="ค้นหา..."
                            value={zip}
                            onChange={e => handleZipcodeChange(e.target.value, formType)}
                        />
                        {/* Auto-complete Dropdown */}
                        {activeZipField === formType && addressSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 w-full min-w-[200px] bg-white shadow-xl rounded-lg border border-gray-200 z-50 max-h-48 overflow-y-auto mt-1">
                                {addressSuggestions.map((addr, idx) => (
                                    <div 
                                        key={idx} 
                                        onClick={() => selectAddress(addr)}
                                        className="px-4 py-2 hover:bg-emerald-50 cursor-pointer text-sm border-b last:border-0"
                                    >
                                        <span className="font-bold text-emerald-600">{addr.postcode}</span>
                                        <span className="text-gray-600 block text-xs">{addr.subDistrict[0]} {' > '} {addr.district} {' > '} {addr.province}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div><label className="text-xs text-gray-500 block mb-1 font-bold">จังหวัด</label><input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700" readOnly value={prov}/></div>
                    <div><label className="text-xs text-gray-500 block mb-1 font-bold">เขต/อำเภอ</label><input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700" readOnly value={dist}/></div>
                    <div><label className="text-xs text-gray-500 block mb-1 font-bold">แขวง/ตำบล</label><input type="text" className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-gray-700" readOnly value={sub}/></div>
                </div>
                <textarea 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none mt-2" 
                    placeholder="บ้านเลขที่, หมู่บ้าน, ซอย, ถนน..." 
                    rows={2}
                    value={detail}
                    onChange={e => setDetail(e.target.value)}
                ></textarea>
            </div>
        );
    };

    const AddressSection = ({ type, label, valueType, onChangeType, formType, prefix }) => (
        <div className="mt-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
            <div className="flex items-center gap-4 mb-3">
                <span className="font-bold text-gray-700 min-w-[120px]">{label}</span>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`${type}_type`} checked={valueType === 'same'} onChange={() => onChangeType('same')} className="text-emerald-500 focus:ring-emerald-500"/>
                    <span className="text-sm">เหมือนที่อยู่หลัก</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name={`${type}_type`} checked={valueType === 'custom'} onChange={() => onChangeType('custom')} className="text-emerald-500 focus:ring-emerald-500"/>
                    <span className="text-sm">ระบุเพิ่มเติม</span>
                </label>
            </div>
            {valueType === 'custom' && (
                <FullAddressForm prefix={prefix} formType={formType} />
            )}
        </div>
    );

    const FormRow = ({ label, children }) => (
        <div className="flex items-center gap-4">
            <label className="text-sm font-bold text-gray-700 w-32 shrink-0 text-right">{label}</label>
            <div className="flex-1">{children}</div>
        </div>
    );

    const SwitchRow = ({ label, checked, onChange, icon: Icon }) => (
        <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
                {Icon && <Icon size={16} className="text-gray-500"/>}
                <span className="text-gray-700 font-medium">{label}</span>
            </div>
            <div 
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-emerald-500' : 'bg-gray-300'}`}
                onClick={() => onChange(!checked)}
            >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );

    return (
        <div className="h-screen w-full bg-[#F9FAFB] flex overflow-hidden">
            <BaseSidebarLayout menuItems={menuItems} activePage={activeTab} onNavigate={onNavigate} onOpenDrawer={onOpenDrawer} />
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-center shrink-0 relative shadow-sm z-20">
                    <h1 className={`${FONTS.header} text-xl font-bold text-gray-800`}>ตั้งค่าร้านค้า</h1>
                    <button onClick={handleSave} className="absolute right-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-full font-bold shadow-lg shadow-emerald-200 transition-all flex items-center gap-2">
                        <Save size={18} /> บันทึก
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar">


                    {activeTab === 'general' ? (
                        <div className="pb-20">
                            {/* 2. Banner Collage & Logo */}
                            <div className="relative mb-16">
                                <div className="h-64 grid grid-cols-4 grid-rows-2 gap-1 bg-gray-200">
                                    <div className="col-span-2 row-span-2 relative group overflow-hidden bg-gray-300 flex items-center justify-center cursor-pointer">
                                        <Camera className="text-gray-400 group-hover:scale-110 transition"/>
                                        <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">หน้าร้าน (Main)</span>
                                    </div>
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="relative group overflow-hidden bg-gray-300 border-l border-white flex items-center justify-center cursor-pointer">
                                            <Camera className="text-gray-400 group-hover:scale-110 transition"/>
                                            <span className="absolute bottom-2 right-2 text-xs bg-black/50 text-white px-2 py-1 rounded">ภายใน {i}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
                                    <div 
                                        onClick={handleLogoClick}
                                        className={`
                                        relative bg-white flex items-center justify-center cursor-pointer group border-4 border-white
                                        ${logoShape === 'circle' ? 'w-40 h-40 rounded-full' : ''}
                                        ${logoShape === 'rounded-square' ? 'w-40 h-40 rounded-[2rem]' : ''}
                                        ${logoShape === 'rounded-rect' ? 'w-56 h-40 rounded-[2rem]' : ''}
                                        shadow-[0_0_30px_10px_rgba(255,215,0,0.5)] 
                                        transition-all duration-300
                                    `}>
                                        <div className="text-gray-300 flex flex-col items-center group-hover:text-emerald-500 transition-colors">
                                            <Upload size={32} className="mb-2 text-emerald-500"/>
                                            <span className="text-xs font-bold text-gray-400 group-hover:text-emerald-500">Upload Logo</span>
                                        </div>
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
                                        <LogoShapeSelector />
                                    </div>
                                </div>
                            </div>

                            <div className="max-w-6xl mx-auto px-6 space-y-8">
                                {/* 3. Shop Basic Info */}
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 pt-10 mt-8 relative">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2"><Store size={20} className="text-emerald-500"/> ข้อมูลร้านค้า</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                                        <FormRow label="รหัสร้านค้า">
                                            <div className="font-mono bg-gray-100 text-gray-500 px-3 py-2 rounded-lg">{generalForm.shopCode}</div>
                                        </FormRow>
                                        <FormRow label="ชื่อร้านค้า">
                                            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ระบุชื่อร้าน..." value={generalForm.shopName} onChange={e=>setGeneralForm({...generalForm, shopName: e.target.value})}/>
                                        </FormRow>
                                        <FormRow label="ชื่อสาขา">
                                            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="เช่น สาขาหลัก..." value={generalForm.branch} onChange={e=>setGeneralForm({...generalForm, branch: e.target.value})}/>
                                        </FormRow>
                                        <FormRow label="รหัสสาขา">
                                            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ระบุรหัสสาขา..." value={generalForm.branchCode} onChange={e=>setGeneralForm({...generalForm, branchCode: e.target.value})}/>
                                        </FormRow>
                                        <FormRow label="ชื่อผู้จัดการ">
                                            <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="ระบุชื่อผู้จัดการ..." value={generalForm.managerName} onChange={e=>setGeneralForm({...generalForm, managerName: e.target.value})}/>
                                        </FormRow>
                                        <FormRow label="เลขบัตร ปชช.">
                                            <div className="relative">
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 font-mono tracking-widest pr-8" 
                                                    placeholder="x-xxxx-xxxxx-xx-x" 
                                                    value={generalForm.managerIdCard} 
                                                    onChange={e => {
                                                        const v = e.target.value;
                                                        setGeneralForm({...generalForm, managerIdCard: v}) 
                                                    }}
                                                    onBlur={() => {
                                                        if(generalForm.managerIdCard.length === 13) {
                                                            const masked = generalForm.managerIdCard.substring(0,6) + '*****' + generalForm.managerIdCard.substring(11);
                                                            setGeneralForm({...generalForm, managerIdCard: masked});
                                                        }
                                                    }}
                                                />
                                                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14}/>
                                            </div>
                                        </FormRow>
                                    </div>
                                    <p className="text-right text-xs text-gray-400 mt-2">*ข้อมูลส่วนตัวจะถูกซ่อนอัตโนมัติ (3100400*****1)</p>
                                </div>

                                {/* 4. Split Layout: 3 Parts */}
                                <div className="grid grid-cols-12 gap-6">
                                    <div className="col-span-12 md:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800"><MessageCircle size={20} className="text-emerald-500"/> ช่องทางการติดต่อ</h3>
                                        <div className="space-y-3">
                                            {[
                                                { k: 'line', l: 'Line Official', c: 'text-green-500' },
                                                { k: 'facebook', l: 'Facebook Page', c: 'text-blue-600' },
                                                { k: 'tiktok', l: 'TikTok Shop', c: 'text-black' },
                                                { k: 'instagram', l: 'Instagram', c: 'text-pink-600' },
                                                { k: 'shopee', l: 'Shopee', c: 'text-orange-500' },
                                                { k: 'lazada', l: 'Lazada', c: 'text-blue-500' },
                                                { k: 'whatsapp', l: 'WhatsApp', c: 'text-green-600' },
                                                { k: 'wechat', l: 'WeChat', c: 'text-green-500' },
                                            ].map(item => (
                                                <div key={item.k} className="flex items-center gap-3">
                                                    <div className={`w-8 flex justify-center ${item.c}`}><Globe size={18}/></div>
                                                    <input 
                                                        type="text" 
                                                        placeholder={item.l}
                                                        className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:bg-white focus:ring-1 focus:ring-emerald-500 outline-none transition"
                                                        value={generalForm.contacts[item.k]}
                                                        onChange={e => setGeneralForm({ ...generalForm, contacts: { ...generalForm.contacts, [item.k]: e.target.value }})}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-span-12 md:col-span-7 flex flex-col gap-6">
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1">
                                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800"><Tag size={20} className="text-orange-500"/> ประเภทร้านค้า</h3>
                                            <div className="flex gap-2 mb-4">
                                                <input 
                                                    type="text" 
                                                    placeholder="พิมพ์เพื่อเพิ่ม tag..." 
                                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                                    value={customTag}
                                                    onChange={e => setCustomTag(e.target.value)}
                                                    onKeyDown={e => { if(e.key === 'Enter' && customTag) { toggleTag(customTag); setCustomTag(''); }}}
                                                />
                                                <button onClick={() => { if(customTag) { toggleTag(customTag); setCustomTag(''); }}} className="bg-orange-500 text-white px-4 rounded-lg"><Plus/></button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {PRESET_TAGS.map(tag => {
                                                    const isSelected = selectedTags.includes(tag);
                                                    return (
                                                        <button 
                                                            key={tag}
                                                            onClick={() => toggleTag(tag)}
                                                            className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                                                                isSelected 
                                                                ? 'bg-orange-500 text-white border-orange-600 shadow-md transform scale-105' 
                                                                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
                                                            }`}
                                                        >
                                                            {tag}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800"><FileText size={20} className="text-blue-500"/> เกี่ยวกับเรา</h3>
                                                <button onClick={generateAboutUs} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 font-bold flex items-center gap-1 transition-all">
                                                    <Zap size={12}/> แนะนำข้อความ
                                                </button>
                                            </div>
                                            <div className="flex-1 relative">
                                                <textarea 
                                                    className="w-full h-full border border-gray-300 rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-gray-50 leading-relaxed"
                                                    placeholder="ใส่ข้อมูลครบแล้วกดแนะนำ ให้ระบบกรอกอัตโนมัติ..."
                                                    value={generalForm.aboutUs}
                                                    onChange={e => setGeneralForm({...generalForm, aboutUs: e.target.value})}
                                                    rows={4}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 5. Legal & Address Section */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-10">
                                    <h3 className="font-bold text-lg mb-6 pb-2 border-b border-gray-100 flex items-center gap-2 text-gray-800">
                                        <MapPin size={20} className="text-red-500"/> ข้อมูลนิติบุคคล & ที่อยู่
                                    </h3>
                                    
                                    {/* Entity Type */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1">ประเภท</label>
                                            <select 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                                value={generalForm.entityType}
                                                onChange={e => setGeneralForm({...generalForm, entityType: e.target.value})}
                                            >
                                                <option value="ร้านค้า">ร้านค้า (Shop)</option>
                                                <option value="สถานพยาบาล">สถานพยาบาล (Clinic/Hospital)</option>
                                                <option value="คลินิก">คลินิก (Clinic)</option>
                                                <option value="อื่นๆ">อื่นๆ (Other)</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-bold text-gray-700 block mb-1">ชื่อจดทะเบียน</label>
                                            <input 
                                                type="text" 
                                                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none"
                                                placeholder="ชื่อบริษัท / ชื่อ-นามสกุล..."
                                                value={generalForm.entityName}
                                                onChange={e => setGeneralForm({...generalForm, entityName: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    {/* Main Address */}
                                    <FullAddressForm prefix="" label="ที่อยู่ติดต่อ" formType="main" />

                                    {/* Sub Addresses */}
                                    <div className="space-y-2">
                                        <AddressSection 
                                            type="shipping" label="ที่อยู่จัดส่ง" 
                                            valueType={generalForm.shippingAddressType} 
                                            onChangeType={t => setGeneralForm({...generalForm, shippingAddressType: t})}
                                            formType="shipping"
                                            prefix="shipping"
                                        />
                                        <AddressSection 
                                            type="doc" label="ที่อยู่รับเอกสาร" 
                                            valueType={generalForm.docAddressType} 
                                            onChangeType={t => setGeneralForm({...generalForm, docAddressType: t})}
                                            formType="doc"
                                            prefix="doc"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'sales' ? (
                        <div className="pb-20 pt-8 px-6">
                            <div className="max-w-4xl mx-auto space-y-8">
                                {/* Section 1: Tax & Rounding */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                        <Coins size={20} className="text-orange-500"/> ภาษีและการคำนวณ (Tax & Calculation)
                                    </h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* VAT Config */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-gray-700 block">การตั้งค่า VAT</label>
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={() => setSalesForm({...salesForm, vatEnabled: true})}
                                                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${salesForm.vatEnabled ? 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                >
                                                    <CheckCircle size={18} className={salesForm.vatEnabled ? 'opacity-100' : 'opacity-0'}/> มี VAT
                                                </button>
                                                <button 
                                                    onClick={() => setSalesForm({...salesForm, vatEnabled: false})}
                                                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${!salesForm.vatEnabled ? 'border-red-500 bg-red-50 text-red-700 font-bold' : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}
                                                >
                                                    <XCircle size={18} className={!salesForm.vatEnabled ? 'opacity-100' : 'opacity-0'}/> ไม่มี VAT
                                                </button>
                                            </div>
                                            
                                            {salesForm.vatEnabled && (
                                                <div className="animate-in fade-in slide-in-from-top-2">
                                                    <label className="text-xs text-gray-500 block mb-1">อัตราภาษี Default (%)</label>
                                                    <div className="relative">
                                                        <input 
                                                            type="number" 
                                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                                                            value={salesForm.vatRate}
                                                            onChange={e => setSalesForm({...salesForm, vatRate: parseFloat(e.target.value)})}
                                                        />
                                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">%</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Rounding Config */}
                                        <div className="space-y-4">
                                            <label className="text-sm font-bold text-gray-700 block">การปัดเศษ (Rounding)</label>
                                            <div className="space-y-2">
                                                {[
                                                    { id: 'universal', label: 'สากล (Universal)' },
                                                    { id: 'up', label: 'ปัดขึ้น (Round Up)' },
                                                    { id: 'down', label: 'ปัดลง (Round Down)' }
                                                ].map(opt => (
                                                    <label key={opt.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                                                        <input 
                                                            type="radio" 
                                                            name="rounding" 
                                                            className="w-5 h-5 text-emerald-500 focus:ring-emerald-500"
                                                            checked={salesForm.roundingMode === opt.id}
                                                            onChange={() => setSalesForm({...salesForm, roundingMode: opt.id})}
                                                        />
                                                        <span className="text-gray-700">{opt.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Payment Methods (Redesigned) */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                        <Wallet size={20} className="text-blue-500"/> ช่องทางชำระผ่าน E-wallet
                                    </h3>
                                    
                                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                                        
                                        <div className="flex justify-between items-start mb-6 relative z-10">
                                            <div>
                                                <h4 className="text-2xl font-bold flex items-center gap-2">Xendit <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">Partner</span></h4>
                                                <p className="text-gray-400 text-sm mt-1">รับชำระเงินครบวงจร จบในที่เดียว</p>
                                            </div>
                                            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-bold shadow-lg shadow-emerald-500/30 transition-all text-sm">
                                                สมัครเลย
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/5">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center"><QrCode size={16}/></div>
                                                    <div>
                                                        <span className="block font-bold text-sm">Thai PromptPay</span>
                                                        <span className="text-xs text-gray-400">QR Payment</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/5">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center"><CreditCardIcon size={16}/></div>
                                                    <div>
                                                        <span className="block font-bold text-sm">Credit Cards</span>
                                                        <span className="text-xs text-gray-400">Visa, Mastercard, JCB</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/5">
                                                    <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center"><Wallet size={16}/></div>
                                                    <div>
                                                        <span className="block font-bold text-sm">E-Wallets</span>
                                                        <span className="text-xs text-gray-400">Alipay, Rabbit Pay, WePay</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl mt-2">
                                                    <span className="text-sm text-gray-300">ค่าธรรมเนียม (Fees)</span>
                                                    <span className="font-bold text-emerald-400">0.8 - 3.2%</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-gray-300">
                                                <Bell size={16}/> แจ้งเตือนยอดเข้า (Xendit Notification)
                                            </div>
                                            <div 
                                                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${salesForm.xenditNotify ? 'bg-emerald-500' : 'bg-gray-600'}`}
                                                onClick={() => setSalesForm({...salesForm, xenditNotify: !salesForm.xenditNotify})}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${salesForm.xenditNotify ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Operating Hours (Redesigned) */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                        <Clock size={20} className="text-purple-500"/> วันและเวลาทำการ (Smart Scheduler)
                                    </h3>
                                    
                                    {/* Control Bar */}
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 mb-6 flex flex-wrap items-center gap-4">
                                        {/* Time Input */}
                                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-300 shadow-sm">
                                            <Clock size={16} className="text-gray-400"/>
                                            <input 
                                                type="time" 
                                                value={tempStartTime}
                                                onChange={e => setTempStartTime(e.target.value)}
                                                className="bg-transparent outline-none text-sm font-bold text-gray-700 w-20 text-center"
                                            />
                                            <span className="text-gray-400">-</span>
                                            <input 
                                                type="time" 
                                                value={tempEndTime}
                                                onChange={e => setTempEndTime(e.target.value)}
                                                className="bg-transparent outline-none text-sm font-bold text-gray-700 w-20 text-center"
                                            />
                                        </div>

                                        {/* Day Selector */}
                                        <div className="flex gap-1.5">
                                            {DAYS_SHORT.map((d, i) => (
                                                <button 
                                                    key={i}
                                                    onClick={() => toggleDaySelection(i)}
                                                    className={`w-9 h-9 rounded-full text-sm font-bold transition-all ${
                                                        tempSelectedDays.includes(i) 
                                                        ? 'bg-purple-600 text-white shadow-md transform scale-105' 
                                                        : 'bg-white text-gray-400 border border-gray-200 hover:border-purple-300'
                                                    }`}
                                                >
                                                    {d}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Action Button */}
                                        <button 
                                            onClick={handleApplyHours}
                                            className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-purple-200 transition-all flex items-center gap-2 text-sm"
                                        >
                                            <Check size={16}/> ตกลง
                                        </button>
                                    </div>

                                    {/* Display List */}
                                    <div className="space-y-2">
                                        {salesForm.operatingHours.map((item, idx) => (
                                            <div key={idx} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${item.open ? 'bg-white border-gray-100' : 'bg-gray-50 border-transparent opacity-60'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-2 h-8 rounded-full ${item.open ? 'bg-emerald-400' : 'bg-red-300'}`}></div>
                                                    <span className="font-bold text-gray-700 min-w-[80px]">{item.day}</span>
                                                </div>
                                                
                                                {item.open ? (
                                                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-1.5 rounded-lg border border-gray-200">
                                                        <span className="font-mono font-bold text-gray-700">{item.start}</span>
                                                        <span className="text-gray-400">-</span>
                                                        <span className="font-mono font-bold text-gray-700">{item.end}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-red-400 font-bold text-sm bg-red-50 px-3 py-1 rounded-full flex items-center gap-1">
                                                        <Ban size={12}/> ปิดร้าน
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : activeTab === 'stock_sys' ? (
                        // --- NEW STOCK SYSTEM TAB ---
                        <div className="pb-20 pt-8 px-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="max-w-4xl mx-auto space-y-8">
                                
                                {/* 1. Costing Method */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                        <Calculator size={20} className="text-indigo-500"/> ระบบคำนวณต้นทุน (Costing Method)
                                    </h3>
                                    <p className="text-gray-500 text-sm mb-4">เลือกวิธีการคำนวณต้นทุนสินค้าคงคลังที่เหมาะสมกับธุรกิจของคุณ (เมื่อเลือกแล้วไม่ควรเปลี่ยนบ่อย)</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'fifo', label: 'FIFO', desc: 'เข้าก่อน ออกก่อน', longDesc: 'สินค้าที่ซื้อมาก่อนจะถูกขายออกไปก่อน เหมาะกับสินค้ามีวันหมดอายุ' },
                                            { id: 'average', label: 'Average', desc: 'ถัวเฉลี่ย', longDesc: 'คำนวณต้นทุนเฉลี่ยทุกครั้งที่มีการซื้อเข้า เหมาะกับสินค้าที่ราคาผันผวน' },
                                            { id: 'lifo', label: 'LIFO', desc: 'เข้าหลัง ออกก่อน', longDesc: 'สินค้าที่ซื้อมาล่าสุดจะถูกขายก่อน (ไม่แนะนำสำหรับสินค้าทั่วไป)' }
                                        ].map(method => (
                                            <div 
                                                key={method.id}
                                                onClick={() => setStockForm({...stockForm, costingMethod: method.id})}
                                                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all relative overflow-hidden ${stockForm.costingMethod === method.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className={`text-xl font-bold ${stockForm.costingMethod === method.id ? 'text-indigo-700' : 'text-gray-700'}`}>{method.label}</span>
                                                    {stockForm.costingMethod === method.id && <CheckCircle className="text-indigo-500" size={20}/>}
                                                </div>
                                                <span className="text-sm font-bold text-gray-600 block mb-1">{method.desc}</span>
                                                <p className="text-xs text-gray-400 leading-relaxed">{method.longDesc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 2. Inventory Rules & Alerts */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                        <ShieldAlert size={20} className="text-rose-500"/> กฎการควบคุมคลัง (Inventory Rules)
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        {/* Negative Stock */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div>
                                                <span className="font-bold text-gray-700 flex items-center gap-2"><AlertOctagon size={18} className="text-gray-500"/> อนุญาตให้สต็อกติดลบ (Negative Stock)</span>
                                                <p className="text-xs text-gray-500 mt-1">สามารถขายสินค้าได้แม้จำนวนในระบบเป็น 0 (เหมาะสำหรับการขาย Pre-order)</p>
                                            </div>
                                            <div 
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${stockForm.allowNegativeStock ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                onClick={() => setStockForm({...stockForm, allowNegativeStock: !stockForm.allowNegativeStock})}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${stockForm.allowNegativeStock ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>

                                        {/* Low Stock Alert */}
                                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="font-bold text-gray-700 flex items-center gap-2"><Bell size={18} className="text-gray-500"/> แจ้งเตือนสินค้าใกล้หมด (Low Stock Alert)</span>
                                                <div 
                                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${stockForm.lowStockAlert ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                    onClick={() => setStockForm({...stockForm, lowStockAlert: !stockForm.lowStockAlert})}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${stockForm.lowStockAlert ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                            
                                            {stockForm.lowStockAlert && (
                                                <div className="flex items-center gap-4 bg-rose-50 p-3 rounded-lg border border-rose-100 animate-in fade-in slide-in-from-top-2">
                                                    <span className="text-sm text-rose-700">เตือนเมื่อสินค้าคงเหลือต่ำกว่า:</span>
                                                    <div className="relative w-24">
                                                        <input 
                                                            type="number" 
                                                            className="w-full text-center border border-rose-200 rounded-lg py-1 px-2 text-rose-700 font-bold focus:ring-2 focus:ring-rose-200 outline-none bg-white"
                                                            value={stockForm.lowStockThreshold}
                                                            onChange={e => setStockForm({...stockForm, lowStockThreshold: parseInt(e.target.value) || 0})}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-rose-700">ชิ้น</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Audit Schedule Alert (Updated) */}
                                        <div className="p-4 bg-white rounded-xl border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="font-bold text-gray-700 flex items-center gap-2"><CalendarClock size={18} className="text-gray-500"/> แจ้งเตือนนับสต็อกตามรอบ (Force Audit Schedule)</span>
                                                    <p className="text-xs text-gray-500 mt-1">บังคับให้สินค้าทุกรายการต้องถูกตรวจนับตามวันที่กำหนด (All items must be audited on schedule)</p>
                                                </div>
                                                <div 
                                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${stockForm.forceAuditSchedule ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                    onClick={() => setStockForm({...stockForm, forceAuditSchedule: !stockForm.forceAuditSchedule})}
                                                >
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${stockForm.forceAuditSchedule ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                                

                                            {stockForm.forceAuditSchedule && (
                                                <div className="mt-3 flex items-center gap-4 bg-blue-50 p-3 rounded-lg border border-blue-100 animate-in fade-in slide-in-from-top-2">
                                                    <span className="text-sm text-blue-700">รอบการนับสินค้าทุกๆ:</span>
                                                    <div className="relative w-24">
                                                        <input 
                                                            type="number" 
                                                            className="w-full text-center border border-blue-200 rounded-lg py-1 px-2 text-blue-700 font-bold focus:ring-2 focus:ring-blue-200 outline-none bg-white"
                                                            value={stockForm.auditPeriod || 30}
                                                            onChange={e => setStockForm({...stockForm, auditPeriod: parseInt(e.target.value) || 0})}
                                                        />
                                                    </div>
                                                    <span className="text-sm text-blue-700">วัน</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Auto PO */}
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div>
                                                <span className="font-bold text-gray-700 flex items-center gap-2"><FileText size={18} className="text-gray-500"/> สร้างใบสั่งซื้ออัตโนมัติ (Auto Purchase Order)</span>
                                                <p className="text-xs text-gray-500 mt-1">ระบบจะร่างใบ PO ให้ทันทีเมื่อสินค้าถึงจุดสั่งซื้อ (Reorder Point)</p>
                                            </div>
                                            <div 
                                                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${stockForm.autoGenPO ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                onClick={() => setStockForm({...stockForm, autoGenPO: !stockForm.autoGenPO})}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${stockForm.autoGenPO ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 3. Advanced Tracking */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2">
                                        <Barcode size={20} className="text-teal-500"/> การติดตามสินค้า (Advanced Tracking) POP UP บันทึกก่อนรับและขายสินค้า
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div 
                                            onClick={() => setStockForm({...stockForm, enableExpiryTracking: !stockForm.enableExpiryTracking})}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${stockForm.enableExpiryTracking ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <CalendarClock className={stockForm.enableExpiryTracking ? 'text-teal-600' : 'text-gray-400'} />
                                                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stockForm.enableExpiryTracking ? 'bg-teal-500' : 'bg-gray-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${stockForm.enableExpiryTracking ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-700 block">ติดตามวันหมดอายุ</span>
                                            <span className="text-xs text-gray-500">Expiry Date Tracking</span>
                                        </div>

                                        <div 
                                            onClick={() => setStockForm({...stockForm, enableBatchTracking: !stockForm.enableBatchTracking})}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${stockForm.enableBatchTracking ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <Package className={stockForm.enableBatchTracking ? 'text-teal-600' : 'text-gray-400'} />
                                                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stockForm.enableBatchTracking ? 'bg-teal-500' : 'bg-gray-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${stockForm.enableBatchTracking ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-700 block">ระบบ Lot / Batch</span>
                                            <span className="text-xs text-gray-500">Lot Number Tracking</span>
                                        </div>

                                        <div 
                                            onClick={() => setStockForm({...stockForm, enableSerialTracking: !stockForm.enableSerialTracking})}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${stockForm.enableSerialTracking ? 'border-teal-500 bg-teal-50' : 'border-gray-200 hover:bg-gray-50 bg-white'}`}
                                        >
                                            <div className="flex justify-between items-center mb-2">
                                                <Barcode className={stockForm.enableSerialTracking ? 'text-teal-600' : 'text-gray-400'} />
                                                <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${stockForm.enableSerialTracking ? 'bg-teal-500' : 'bg-gray-300'}`}>
                                                    <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${stockForm.enableSerialTracking ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                                </div>
                                            </div>
                                            <span className="font-bold text-gray-700 block">Serial Number</span>
                                            <span className="text-xs text-gray-500">ติดตามรายชิ้น (IMEI/Serial)</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : activeTab === 'printer' ? (
                        // --- NEW PRINTER SETTINGS TAB ---
                        <div className="pb-20 pt-8 px-6 animate-in fade-in slide-in-from-bottom-4">
                            <div className="max-w-5xl mx-auto space-y-8">
                                
                                {/* 1. Document Config (Receipt 80x80) */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8">
                                    {/* Left: Input Form */}
                                    <div className="flex-1 space-y-6">
                                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2">
                                            <FileCheckIcon size={20} className="text-blue-500"/> ตั้งค่าหัวเอกสาร (80mm Bill)
                                        </h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-1">ชื่อหัวบิล (Shop Name)</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500" 
                                                    value={printerForm.billHeaderName}
                                                    onChange={e => setPrinterForm({...printerForm, billHeaderName: e.target.value})}
                                                    placeholder="ชื่อที่จะแสดงบนหัวใบเสร็จ..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-1">ที่อยู่ (Address)</label>
                                                <textarea 
                                                    rows={3}
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                                                    value={printerForm.billAddress}
                                                    onChange={e => setPrinterForm({...printerForm, billAddress: e.target.value})}
                                                    placeholder="ที่อยู่ร้าน..."
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-bold text-gray-700 block mb-1">เลขประจำตัวผู้เสียภาษี (Tax ID)</label>
                                                <input 
                                                    type="text" 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 font-mono" 
                                                    value={printerForm.taxId}
                                                    onChange={e => setPrinterForm({...printerForm, taxId: e.target.value})}
                                                    placeholder="0123456789012"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-100">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">เอกสารที่ใช้งาน</label>
                                            <div className="flex flex-wrap gap-4">
                                                {[
                                                    { id: 'enableDeliveryNote', label: 'ใบส่งของ (Delivery Note)' },
                                                    { id: 'enableReceipt', label: 'ใบเสร็จรับเงิน (Receipt)' },
                                                    { id: 'enableTaxInvoice', label: 'ใบกำกับภาษีอย่างย่อ (Tax Invoice)' }
                                                ].map(doc => (
                                                    <label key={doc.id} className="flex items-center gap-2 cursor-pointer bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={printerForm[doc.id]} 
                                                            onChange={e => setPrinterForm({...printerForm, [doc.id]: e.target.checked})}
                                                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                                        />
                                                        <span className="text-sm text-gray-700">{doc.label}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right: Live Preview */}
                                    <div className="w-80 shrink-0">
                                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 text-center">ตัวอย่างใบเสร็จ (Preview)</div>
                                        <div className="bg-white border border-gray-200 shadow-lg p-6 font-mono text-xs leading-relaxed text-gray-600 relative overflow-hidden transition-all duration-300">
                                            {/* Paper tear effect top */}
                                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-b from-gray-100 to-transparent"></div>
                                            
                                            <div className="text-center mb-4 space-y-1">
                                                <h4 className="text-sm font-bold text-black break-words">{printerForm.billHeaderName || 'ชื่อร้านค้า'}</h4>
                                                <p className="max-w-[200px] mx-auto break-words">{printerForm.billAddress || 'ที่อยู่ร้านค้า...'}</p>
                                                <p>TAX ID: {printerForm.taxId || '-'}</p>
                                                {/* Dynamic Doc Title */}
                                                <p className="mt-2 font-bold text-black border-b border-black pb-1 inline-block">
                                                    {getPreviewDocTitle()}
                                                </p>
                                            </div>
                                            
                                            <div className="border-t border-dashed border-gray-300 my-2 pt-2">
                                                <div className="flex justify-between"><span>สินค้า A</span><span>100.00</span></div>
                                                <div className="flex justify-between"><span>สินค้า B (x2)</span><span>200.00</span></div>
                                            </div>
                                            
                                            <div className="border-t border-dashed border-gray-300 my-2 pt-2">
                                                <div className="flex justify-between font-bold text-black text-sm"><span>รวมทั้งสิ้น</span><span>300.00</span></div>
                                                <div className="flex justify-between text-[10px]"><span>VAT 7%</span><span>19.63</span></div>
                                            </div>
                                            
                                            <div className="text-center mt-6 text-[10px] text-gray-400">
                                                <p>ขอบคุณที่ใช้บริการ</p>
                                                <p>Powered by Pet Omni</p>
                                            </div>

                                            {/* Paper tear effect bottom */}
                                            <div className="absolute bottom-0 left-0 w-full h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSI+PHBhdGggZD0iTTAgMTBMMTAgMEwyMCAxMEwwIDEwWiIgZmlsbD0iI2YzZjRmNiIvPjwvc3ZnPg==')] bg-repeat-x bg-bottom"></div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. Printer Management */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="flex justify-between items-center mb-6 border-b pb-2">
                                        <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800">
                                            <Printer size={20} className="text-purple-500"/> จัดการเครื่องพิมพ์ (Printers)
                                        </h3>
                                        <button 
                                            onClick={handleAddClick}
                                            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-purple-700 flex items-center gap-2 transition-all shadow-md"
                                        >
                                            <PlusCircle size={16}/> เพิ่มเครื่องพิมพ์
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {printerForm.printers.map(printer => (
                                            <div key={printer.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${printer.active ? 'bg-white border-gray-200 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${printer.active ? 'bg-purple-100 text-purple-600' : 'bg-gray-200 text-gray-400'}`}>
                                                        <Printer size={24}/>
                                                    </div>
                                                    <div>
                                                        <h4 className={`font-bold text-base ${printer.active ? 'text-gray-800' : 'text-gray-500'}`}>{printer.name}</h4>
                                                        <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                            <span className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200">{printer.type}</span>
                                                            <span className="flex items-center gap-1"><Server size={10}/> {printer.conn}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right mr-2">
                                                        <span className={`block text-xs font-bold ${printer.active ? 'text-green-500' : 'text-gray-400'}`}>
                                                            {printer.active ? 'พร้อมใช้งาน' : 'ปิดใช้งาน'}
                                                        </span>
                                                    </div>
                                                    
                                                    {/* Toggle Switch */}
                                                    <div 
                                                        onClick={() => togglePrinter(printer.id)}
                                                        className={`w-14 h-7 rounded-full p-1 cursor-pointer transition-colors duration-300 flex items-center ${printer.active ? 'bg-green-500 justify-end' : 'bg-gray-300 justify-start'}`}
                                                    >
                                                        <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
                                                    </div>
                                                    
                                                    <button className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors">
                                                        <Trash2 size={18}/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                        </div>
// =====NEW FEATURE ===========                    
					) : activeTab === 'system' ? (
                        <div className="pb-20 pt-8 px-6 animate-in fade-in slide-in-from-bottom-4">
                             <div className="max-w-4xl mx-auto space-y-8">
                                
                                {/* 1. Theme Selection & Scheduling (UPGRADED) */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                     <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                                         <h3 className="font-bold text-lg flex items-center gap-2 text-gray-800"><Palette size={20} className="text-pink-500"/> ธีมและการแสดงผล</h3>
                                         
                                         {/* Auto Theme Toggle */}
                                         <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                                             <span className="text-xs font-bold text-gray-600">ตั้งเวลาเปลี่ยนธีม (Auto)</span>
                                             <div 
                                                onClick={() => setSystemSettings({...systemSettings, autoTheme: !systemSettings.autoTheme})}
                                                className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${systemSettings.autoTheme ? 'bg-pink-500' : 'bg-gray-300'}`}
                                             >
                                                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${systemSettings.autoTheme ? 'translate-x-5' : 'translate-x-0'}`}></div>
                                             </div>
                                         </div>
                                     </div>

                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        {Object.entries(APP_THEMES).map(([key, theme]) => (
                                            <div 
                                                key={key}
                                                onClick={() => onChangeTheme && onChangeTheme(theme)}
                                                className={`cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:scale-105 hover:shadow-xl ${currentTheme?.name === theme.name ? 'border-emerald-500 ring-4 ring-emerald-100' : 'border-gray-200'}`}
                                            >
                                                <div className={`h-24 ${key === 'luxury' ? 'bg-zinc-900' : key === 'lover' ? 'bg-rose-100' : 'bg-gray-100'} flex items-center justify-center`}>
                                                    <span className={`font-bold ${key === 'luxury' ? 'text-white' : 'text-gray-600'}`}>{theme.name}</span>
                                                </div>
                                            </div>
                                        ))}
                                     </div>

                                     {/* Theme Schedule Config */}
                                     {systemSettings.autoTheme && (
                                         <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 flex flex-wrap items-center gap-4 animate-in slide-in-from-top-2">
                                             <div className="flex items-center gap-2">
                                                 <Clock size={16} className="text-pink-500"/>
                                                 <span className="text-sm font-bold text-pink-700">โหมดกลางคืนเริ่ม:</span>
                                                 <input type="time" className="border border-pink-200 rounded px-2 py-1 text-sm outline-none focus:border-pink-500" value={systemSettings.themeStartTime} onChange={e => setSystemSettings({...systemSettings, themeStartTime: e.target.value})}/>
                                             </div>
                                             <div className="flex items-center gap-2">
                                                 <span className="text-sm font-bold text-pink-700">ถึง:</span>
                                                 <input type="time" className="border border-pink-200 rounded px-2 py-1 text-sm outline-none focus:border-pink-500" value={systemSettings.themeEndTime} onChange={e => setSystemSettings({...systemSettings, themeEndTime: e.target.value})}/>
                                             </div>
                                             <div className="flex items-center gap-2 ml-auto">
                                                 <span className="text-sm font-bold text-pink-700">ใช้ธีม:</span>
                                                 <select className="border border-pink-200 rounded px-2 py-1 text-sm outline-none" value={systemSettings.nightTheme} onChange={e => setSystemSettings({...systemSettings, nightTheme: e.target.value})}>
                                                     <option value="luxury">Luxury Dark</option>
                                                     <option value="lover">Sweet Pink</option>
                                                 </select>
                                             </div>
                                         </div>
                                     )}
                                </div>

                                {/* 2. Regional & Timezone (UPGRADED) */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                     <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2"><Globe size={20} className="text-blue-500"/> ภูมิภาคและเวลา (Regional)</h3>
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1">ภาษา (Language)</label>
                                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white" value={systemSettings.language} onChange={e => setSystemSettings({...systemSettings, language: e.target.value})}>
                                                <option value="th">ไทย (Thai)</option>
                                                <option value="en">English</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-bold text-gray-700 block mb-1">โซนเวลา (Timezone)</label>
                                            <div className="relative">
                                                <Clock3 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16}/>
                                                <select 
                                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                                    value={systemSettings.timezone}
                                                    onChange={e => setSystemSettings({...systemSettings, timezone: e.target.value})}
                                                >
                                                    <option value="Asia/Bangkok">(GMT+07:00) Bangkok, Hanoi, Jakarta</option>
                                                    <option value="Asia/Tokyo">(GMT+09:00) Osaka, Sapporo, Tokyo</option>
                                                    <option value="Europe/London">(GMT+00:00) London</option>
                                                    <option value="America/New_York">(GMT-05:00) Eastern Time (US & Canada)</option>
                                                </select>
                                            </div>
                                        </div>
                                     </div>
                                </div>

                                {/* 3. Customer Display System (CDS) */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                     <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800 border-b pb-2"><Monitor size={20} className="text-emerald-500"/> จอภาพฝั่งลูกค้า (Customer Display)</h3>
                                     
                                     <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 mb-6">
                                         <div className="flex items-center gap-3">
                                             <div className="p-2 bg-emerald-500 rounded-lg text-white"><Monitor size={24}/></div>
                                             <div>
                                                 <h4 className="font-bold text-emerald-900">เปิดใช้งานจอที่ 2</h4>
                                                 <p className="text-xs text-emerald-700">แสดงรายการสินค้าและโปรโมชั่นให้ลูกค้าเห็น</p>
                                             </div>
                                         </div>
                                         <div 
                                            onClick={() => setSystemSettings({...systemSettings, enableCDS: !systemSettings.enableCDS})}
                                            className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-300 ${systemSettings.enableCDS ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${systemSettings.enableCDS ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                     </div>

                                     {systemSettings.enableCDS && (
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
                                             <div>
                                                 <label className="text-sm font-bold text-gray-700 block mb-2">เนื้อหาเมื่อพักหน้าจอ (Idle Content)</label>
                                                 <select 
                                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none bg-white"
                                                    value={systemSettings.cdsContent}
                                                    onChange={e => setSystemSettings({...systemSettings, cdsContent: e.target.value})}
                                                 >
                                                     <option value="slideshow">ภาพสไลด์โชว์ (Promotion Slides)</option>
                                                     <option value="static_image">ภาพนิ่ง (Logo)</option>
                                                     <option value="cart_only">แสดงหน้าตะกร้าเปล่า</option>
                                                 </select>
                                             </div>
                                             <div>
                                                 <label className="text-sm font-bold text-gray-700 block mb-2">ความสว่างหน้าจอ ({systemSettings.cdsBrightness}%)</label>
                                                 <input 
                                                    type="range" min="10" max="100" 
                                                    className="w-full accent-emerald-500"
                                                    value={systemSettings.cdsBrightness}
                                                    onChange={e => setSystemSettings({...systemSettings, cdsBrightness: e.target.value})}
                                                 />
                                             </div>
                                         </div>
                                     )}
                                </div>
                             </div>
                        </div>
// =====NEW FEATURE ===========
                    ) : activeTab === 'channels'? (
                        <div className="pb-20 pt-8 px-6 animate-in fade-in slide-in-from-bottom-4">
                             <div className="max-w-4xl mx-auto space-y-8">
                                {/* Local / Own Channel */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2"><StoreIcon size={20} className="text-emerald-500"/> หน้าร้านออนไลน์ของฉัน (My Shop)</h3>
                                    <div className="space-y-3">
                                        <ChannelRow icon={GlobeIcon} title="Popup.local.com" desc="เว็บไซต์หลัก" channelKey="popupLocal" color="text-indigo-600" bgColor="bg-indigo-100"/>
                                    </div>
                                </div>

                                {/* Thai Marketplace */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2"><Package size={20} className="text-orange-500"/> ตลาดสัตว์เลี้ยงไทย (Thai Pet Market)</h3>
                                    <div className="space-y-3">
                                        <ChannelRow icon={Store} title="The Pets Zoo Marketplace" desc="ตลาดนัดสัตว์เลี้ยงออนไลน์" channelKey="petsZoo" color="text-orange-600" bgColor="bg-orange-100"/>
                                    </div>
                                </div>

                                {/* Social Media */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2"><SmartphoneIcon size={20} className="text-blue-500"/> โซเชียลมีเดีย (Social Commerce)</h3>
                                    <div className="space-y-3">
                                        <ChannelRow icon={Facebook} title="Facebook Shop" desc="เชื่อมต่อแคตตาล็อก" channelKey="facebook" color="text-blue-600" bgColor="bg-blue-100"/>
                                        <ChannelRow icon={Instagram} title="Instagram Shopping" desc="Tag สินค้าในโพสต์" channelKey="instagram" color="text-pink-600" bgColor="bg-pink-100"/>
                                        <ChannelRow icon={Video} title="TikTok Shop" desc="ตะกร้าสินค้าในคลิป" channelKey="tiktok" color="text-black" bgColor="bg-gray-200"/>
                                    </div>
                                </div>

                                {/* Platform Marketplace */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800 border-b pb-2"><ShoppingBag size={20} className="text-purple-500"/> แพลตฟอร์มมาร์เก็ตเพลส (E-Marketplace)</h3>
                                    <div className="space-y-3">
                                        <ChannelRow icon={ShoppingBag} title="Shopee" desc="Sync สต็อกและคำสั่งซื้อ" channelKey="shopee" color="text-orange-500" bgColor="bg-orange-50"/>
                                        <ChannelRow icon={ShoppingBag} title="Lazada" desc="จัดการร้านค้า Lazada" channelKey="lazada" color="text-blue-600" bgColor="bg-blue-50"/>
                                    </div>
                                </div>
                             </div>
                        </div>
                    ) : activeTab === 'notif' ? (
                        <div className="pb-20 pt-8 px-6 animate-in fade-in slide-in-from-bottom-4">
                             <div className="max-w-4xl mx-auto space-y-8 text-center text-gray-400">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                                     <div className="mx-auto mb-4 text-gray-300 w-12 h-12 flex items-center justify-center">
                                         {activeTab === 'notif' && <Bell size={48}/>}
                                     </div>
                                     {/* แก้ไขตรงนี้: เปลี่ยนจาก {getPageTitle()} เป็นข้อความ String */}
                                     <h3 className="text-lg font-bold text-gray-600 mb-2">การแจ้งเตือน (Notifications)</h3>
                                     <p>Configuration Page Placeholder</p>
                                </div>
                             </div>
                        </div>
                    ) : null
                }
                </div>
            </div>
		           
            {/* Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-in fade-in zoom-in duration-200">
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-500"><Lock size={32} /></div>
                            <h3 className="text-xl font-bold text-gray-800">ยืนยันตัวตน</h3>
                            <p className="text-gray-500 text-sm mt-1">กรุณากรอกรหัสผ่านเจ้าของร้านเพื่อบันทึกการเปลี่ยนแปลง</p>
                        </div>
                        <input type="password" autoFocus className="w-full text-center text-2xl font-bold tracking-widest border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:ring-4 focus:ring-red-100 outline-none" placeholder="PIN / Password" value={passwordInput} onChange={e => setPasswordInput(e.target.value)}/>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setShowPasswordModal(false)} className="py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200">ยกเลิก</button>
                            <button onClick={confirmSave} className="py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200">ยืนยัน</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Discovery Modal */}
            {showDiscoveryModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-2xl w-full flex flex-col h-[500px]">
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-100 rounded-full animate-pulse-ring">
                                    <Search size={24} className="text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-800">ค้นหาเครื่องพิมพ์ (Discovery)</h3>
                                    <p className="text-sm text-gray-500">กำลังค้นหาอุปกรณ์ในเครือข่าย...</p>
                                </div>
                            </div>
                            <button onClick={() => setShowDiscoveryModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
                            {MOCK_DISCOVERED.map(device => (
                                <div key={device.id} className="border border-gray-200 rounded-xl p-4 flex flex-col hover:border-blue-300 hover:shadow-md transition-all bg-white group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                            <Printer size={20}/>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border ${device.conn === 'WiFi' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                            {device.conn}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-gray-800 mb-1">{device.model}</h4>
                                    <p className="text-xs text-gray-500 mb-4">{device.type} {device.ip && `• ${device.ip}`}</p>
                                    <button 
                                        onClick={() => handleSelectForConfig(device)}
                                        className="mt-auto w-full py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Plus size={16}/> เพิ่มอุปกรณ์
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Config Modal */}
            {showConfigModal && draftPrinter && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4 animate-in zoom-in-95 duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                        <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                <Settings size={24}/>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">ตั้งค่าเครื่องพิมพ์</h3>
                                <p className="text-sm text-gray-500">{draftPrinter.model}</p>
                            </div>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">ชื่อเรียก (Display Name)</label>
                                <input 
                                    type="text" 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500"
                                    value={draftPrinter.customName}
                                    onChange={e => setDraftPrinter({...draftPrinter, customName: e.target.value})}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-bold text-gray-700 block mb-1">การเชื่อมต่อ</label>
                                    <div className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-600 text-sm flex items-center gap-2">
                                        {draftPrinter.conn === 'WiFi' ? <Wifi size={14}/> : <Usb size={14}/>}
                                        {draftPrinter.conn}
                                    </div>
                                </div>
                                {draftPrinter.conn !== 'USB' && (
                                    <div>
                                        <label className="text-sm font-bold text-gray-700 block mb-1">IP Address</label>
                                        <input 
                                            type="text" 
                                            className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                                            value={draftPrinter.ip}
                                            onChange={e => setDraftPrinter({...draftPrinter, ip: e.target.value})}
                                        />
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 block mb-1">ขนาดกระดาษ</label>
                                <select 
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                    value={draftPrinter.paperSize}
                                    onChange={e => setDraftPrinter({...draftPrinter, paperSize: e.target.value})}
                                >
                                    <option value="80mm">Thermal 80mm (ใบเสร็จมาตรฐาน)</option>
                                    <option value="58mm">Thermal 58mm (ใบเสร็จเล็ก)</option>
                                    <option value="A4">A4 Document (เอกสารทั่วไป)</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => { setShowConfigModal(false); setDraftPrinter(null); }}
                                className="py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button 
                                onClick={handleSavePrinterConfig}
                                className="py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition-colors"
                            >
                                บันทึก
                            </button>
                        </div>
                    </div>
                </div>
            )
		}
        </div>
    );
};


//============== ZONE: NEW HOME SCREEN (Swipe & Drag) ===================
const HomeScreen = ({ modules, onNavigate, onReorderModules }) => {
    // Pagination Logic
    const itemsPerPage = 12; // 3 rows x 4 cols
    const [page, setPage] = useState(0);
    const totalPages = Math.ceil(modules.length / itemsPerPage);
    const displayedModules = modules.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

// --FEATURE-ICON - Drag & Drop HOME ICON
    const [draggedIndex, setDraggedIndex] = useState(null);
    const handleDragStart = (e, index) => {
        setDraggedIndex(page * itemsPerPage + index);
        e.dataTransfer.effectAllowed = "move";
        // Ghost image styling usually handled by browser, or use custom drag layer
    };
    const handleDragOver = (e, index) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };
    const handleDrop = (e, dropIndexLocal) => {
        e.preventDefault();
        const absoluteDropIndex = page * itemsPerPage + dropIndexLocal;
        if (draggedIndex === null || draggedIndex === absoluteDropIndex) return;

        const newModules = [...modules];
        const [removed] = newModules.splice(draggedIndex, 1);
        newModules.splice(absoluteDropIndex, 0, removed);
        
        onReorderModules(newModules);
        setDraggedIndex(null);
    };

    return (
        <div className="bg-[#141419] min-h-screen w-full flex flex-col overflow-hidden text-white font-sans">
             <style>{`@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;600;700&family=Sarabun:wght@300;400;500;600&display=swap');`}</style>
             
             {/* Header */}
             <header className="h-16 flex items-center justify-between px-6 border-b border-gray-800 bg-[#1E1E24]">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg"><span className={`${FONTS.header} font-bold text-xl`}>P</span></div>
                    <div><h1 className={`${FONTS.header} font-bold text-lg leading-tight`}>Pet Omni Store</h1><p className={`${FONTS.body} text-xs text-purple-400 font-medium`}>สาขาหลัก (Main)</p></div>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long'})}</span>
                    <div className="w-px h-6 bg-gray-700"></div>
                    <div className="flex items-center gap-2 bg-[#2A2A32] px-3 py-1.5 rounded-full border border-gray-700">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-xs text-gray-300">Online</span>
                    </div>
                </div>
             </header>

             <main className="flex-1 p-6 overflow-hidden">
                <div className="grid grid-cols-12 gap-6 h-full">
                    
                    {/* LEFT: Fixed Widgets (Non-draggable) */}
                    <div className="col-span-3 flex flex-col gap-6 h-full">
                        <div className="h-[40%]"><SalesChart data={SALES_HISTORY_DB} /></div>
                        <div className="h-[30%]"><ServiceQueue data={INITIAL_APPOINTMENTS_DATA} /></div>
                        <div className="h-[30%]"><OrderList data={PetProductsDB} /></div>
                    </div>

                    {/* RIGHT: Draggable Icon Grid with Pagination */}
                    <div className="col-span-9 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-4 px-2">
                             <div className="flex items-center gap-2"><LayoutDashboard className="text-purple-400" /><h2 className={`${FONTS.header} text-xl font-bold`}>เมนูหลัก (หน้า {page + 1}/{totalPages})</h2></div>
                             <div className="flex gap-2">
                                 <button disabled={page===0} onClick={()=>setPage(p=>p-1)} className={`p-2 rounded-full border ${page===0 ? 'border-gray-700 text-gray-700' : 'border-gray-500 text-white hover:bg-gray-700'}`}><ChevronLeft/></button>
                                 <button disabled={page===totalPages-1} onClick={()=>setPage(p=>p+1)} className={`p-2 rounded-full border ${page===totalPages-1 ? 'border-gray-700 text-gray-700' : 'border-gray-500 text-white hover:bg-gray-700'}`}><ChevronRight/></button>
                             </div>
                        </div>

                        <div className="flex-1 grid grid-cols-4 grid-rows-3 gap-5 animate-in fade-in duration-300">
                            {displayedModules.map((menu, index) => (
                                <div 
                                    key={menu.id}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDrop={(e) => handleDrop(e, index)}
                                    onClick={() => onNavigate(menu.id)}
                                    className={`${menu.color} rounded-3xl p-4 flex flex-col justify-center items-center gap-3 transition-all duration-200 transform hover:scale-[1.02] shadow-xl group cursor-pointer relative border border-white/5 active:cursor-grabbing`}
                                >
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-50"><Move size={14} className="text-white"/></div>
                                    <div className={`p-4 rounded-2xl bg-white/10 group-hover:bg-white/20 transition-colors`}>
                                        <menu.icon size={36} className="text-white" />
                                    </div>
                                    <span className={`${FONTS.header} text-white text-lg font-bold tracking-wide text-center leading-tight`}>{menu.title}</span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Page Indicators */}
                        <div className="h-8 flex justify-center items-center gap-2 mt-2">
                             {[...Array(totalPages)].map((_, i) => (
                                 <div key={i} onClick={() => setPage(i)} className={`w-2 h-2 rounded-full cursor-pointer transition-all ${page === i ? 'bg-purple-500 w-6' : 'bg-gray-600 hover:bg-gray-400'}`}></div>
                             ))}
                        </div>
                    </div>
                </div>
             </main>
        </div>
    );
};

// =============================CRM SETTING ==========================
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
// =========================LINE OA CONNECTVIEW ====================== 
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

// =====================หน้าประวัติลูกค้า===============**************
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
                        <div className="flex justify-between items-center mb-4"><h3 className={`${FONTS.header} font-bold text-gray-800 flex items-center gap-2`}><Feather size={18} className="text-gray-400"/> จำนวนสัตว์เลี้ยง (ทั้งหมด)</h3>{editingSection === 'stats' ? (<div className="flex gap-2"><button onClick={() => handleSaveSection('stats')} className="text-green-600 hover:text-green-700 bg-green-50 p-1.5 rounded-lg"><Save size={16} /></button><button onClick={() => setEditingSection(null)} className="text-gray-400 hover:text-gray-600 bg-gray-50 p-1.5 rounded-lg"><X size={16} /></button></div>) : (<button onClick={() => setEditingSection('stats')} className="text-gray-400 hover:text-gray-600 transition"><Edit2 size={16} /></button>)}</div>
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
                                <div className="h-full flex flex-col items-center justify-center text-gray-300"><Feather size={64} className="mb-4 opacity-20"/><p>เลือกสัตว์เลี้ยงเพื่อดูรายละเอียด</p></div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ================ หน้าหลัก สมาชิก CRM =================================
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
// ZONE E (Part 5): GROOMING FEATURES
// ==========================================

// --- GROOMING SUB-COMPONENTS (Keep Existing) ---

const BookingCalendar = ({ appointments, setAppointments, onOpenModal }) => {
// ... (BookingCalendar logic remains, only using AppointmentCard)
  const timeSlots = [];
  for(let i=9; i<19; i++) {
    timeSlots.push(`${i.toString().padStart(2, '0')}:00`);
    timeSlots.push(`${i.toString().padStart(2, '0')}:30`);
  }

  const getPosition = (time) => {
    if (!time) return 0;
    const [h, m] = time.split(':').map(Number);
    return ((h - 9) * 60 + m) * 2;
  };

  const getHeight = (start, end) => {
    // Height is calculated in pixels, where 1 minute = 2 pixels
    return getPosition(end) - getPosition(start);
  };
  
  // NEW: Pre-process appointments into individual calendar slots
  const calendarSlots = useMemo(() => {
    return appointments.flatMap(app => {
        // If the appointment has petsWithServices, expand it into sequential slots
        if (app.petsWithServices && app.petsWithServices.length > 1) {
            return getPetSlotTimes(app);
        }
        // Otherwise (single pet or legacy structure), use the original appointment as a single slot
        return [{
            appId: app.id,
            petId: app.petId,
            petName: getPetData(app.petId)?.name || 'N/A',
            groomerId: app.groomerId,
            status: app.status,
            startTime: app.startTime,
            endTime: app.endTime,
            serviceIds: app.serviceIds || [],
        }];
    }).filter(slot => slot && slot.petId); // Ensure only valid slots with a pet are kept
  }, [appointments]);


  // UPDATED AppointmentCard: receives 'slot' data
  const AppointmentCard = ({ slot, originalAppointment }) => {
      // Slot contains petName and serviceIds specific to this pet's time slot
      const groomer = GROOMERS.find(g => g.id === slot.groomerId);
      
      // Get primary service detail for display
      const primaryServiceId = slot.serviceIds[0];
      const primaryService = GROOMING_SERVICES.find(s => s.id === primaryServiceId);
      const serviceCount = slot.serviceIds.length;
      
      const serviceName = primaryService ? primaryService.name : 'Unknown Service';

      // Fallback check (shouldn't happen if filtered properly)
      if (!groomer || serviceCount === 0) return null; 
      
      // When clicking, open modal using the FULL original appointment object
      const handleCardClick = (e) => {
          e.stopPropagation(); 
          onOpenModal(originalAppointment);
      };

      return (
        <div 
            key={slot.appId + slot.petId} // Use composite key for unique slot
            onClick={handleCardClick}
            className={`absolute left-1 right-1 rounded-lg p-2 border-l-4 cursor-pointer hover:brightness-95 transition-all shadow-sm group overflow-hidden ${groomer.color.replace('text-', 'bg-').replace('border-', '')} bg-opacity-20 border-opacity-100 z-20`}
            style={{ 
                top: `${getPosition(slot.startTime)}px`, 
                height: `${getHeight(slot.startTime, slot.endTime)}px` 
            }}
        >
            <div className="flex flex-col h-full">
                <div className="flex justify-between items-start">
                    {/* Display Pet Name for this slot */}
                    <span className={`${FONTS.header} font-bold text-base text-gray-800 line-clamp-1`}>{slot.petName}</span>
                    {/* Indicator for Multi-pet appointment */}
                    {originalAppointment.petsWithServices && originalAppointment.petsWithServices.length > 1 && (
                         <span className="text-[10px] bg-indigo-500 text-white px-1 py-0.5 rounded-full font-bold leading-none">Multi</span>
                    )}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                    <Scissors size={12} className="text-gray-500" />
                    {/* Display Primary Service + count */}
                    <span className="text-xs text-gray-600 line-clamp-1">{serviceName} {serviceCount > 1 ? ` (+${serviceCount - 1})` : ''}</span>
                </div>
                <div className="mt-auto flex items-center justify-between">
                    <span className="text-xs bg-white/60 px-1.5 py-0.5 rounded text-gray-600 font-medium">{slot.startTime} - {slot.endTime}</span>
                </div>
            </div>
        </div>
      );
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
           <div className="w-20 flex-shrink-0 border-r border-gray-100 bg-gray-50/50 pt-10">
              {timeSlots.map(time => (
                  <div key={time} className="h-[60px] text-xs text-gray-400 text-right pr-3 -mt-2.5">
                      {time.endsWith('00') ? time : ''}
                  </div>
              ))}
           </div>

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
                        <div 
                            key={idx} 
                            onClick={() => onOpenModal({ groomerId: groomer.id, startTime: time })}
                            className={`h-[60px] border-b ${time.endsWith('30') ? 'border-gray-50 border-dashed' : 'border-gray-100'} hover:bg-indigo-50/30 cursor-pointer transition-colors relative group`}
                        >
                            <div className="hidden group-hover:flex items-center justify-center h-full w-full">
                                <Plus className="text-indigo-300 opacity-50" size={16} />
                            </div>
                        </div>
                    ))}

                    {/* RENDER CALENDAR SLOTS */}
                    {calendarSlots
                        .filter(slot => slot.groomerId === groomer.id)
                        .map(slot => {
                            // Find the full original appointment object using appId
                            const originalAppointment = appointments.find(a => a.id === slot.appId);
                            if (!originalAppointment) return null;
                            
                            // Render the card using the slot data and passing the original appointment for modal opening
                            return (
                                <AppointmentCard 
                                    key={slot.appId + slot.petId} 
                                    slot={slot} 
                                    originalAppointment={originalAppointment} 
                                />
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

// ... (QuickSetupModal component remains unchanged)
const QuickSetupModal = ({ isOpen, onClose, onConfirm }) => {
    const [petType, setPetType] = useState('dog');
    const [ownerPin, setOwnerPin] = useState('1234');
    const [isPinError, setIsPinError] = useState(false);
    const [prices, setPrices] = useState({});
    const [feedback, setFeedback] = useState({ type: '', message: '' });

    useEffect(() => { setFeedback({ type: '', message: '' }); }, [petType, prices, ownerPin]);
    
    // FIX: Changed type.id to typeId to fix ReferenceError
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
                        id: serviceId, 
                        name: `${type.label} (${petType === 'dog' ? 'สุนัข' : 'แมว'}) ${weightLabel}`,
                        duration: 60, 
                        price: parseFloat(price), 
                        type: petType, 
                        category: type.category, 
                        isQuickSetup: true,
                        weightRangeIdx: weightIdx // Store the index for later filtering
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
                    <div className="flex bg-gray-100 rounded-lg p-1"><button onClick={()=>setPetType('dog')} className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${petType==='dog' ? 'bg-white shadow text-indigo-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}>สุนัข (Dog)</button><button onClick={()=>setPetType('cat')} className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${petType==='cat' ? 'bg-white shadow text-pink-600 ring-1 ring-black/5' : 'text-gray-500 hover:text-gray-700'}`}>แมว (Cat)</button></div>
                </div>
                <div className="flex-1 overflow-auto p-0 custom-scrollbar relative bg-white">
                    <table className="w-full border-collapse">
                        <thead className="sticky top-0 z-30 shadow-sm"><tr><th className="p-4 border-b border-r border-gray-200 bg-gray-50 text-left min-w-[200px] sticky left-0 z-40 text-gray-600 font-bold">บริการ \ น้ำหนัก</th>{WEIGHT_RANGES.map(w => (<th key={w} className="p-3 border-b border-r border-gray-200 bg-gray-50 text-center text-xs font-bold text-gray-600 min-w-[110px] whitespace-nowrap">{w}</th>))}</tr></thead>
                        <tbody>{SERVICE_TYPES_MATRIX.map((type, idx) => (<tr key={type.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}><td className="p-4 border-b border-r border-gray-200 font-bold text-gray-700 bg-white sticky left-0 z-20 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">{type.label}</td>{WEIGHT_RANGES.map((w, weightIdx) => (<td key={w} className="p-0 border-b border-r border-gray-200 relative group"><div className="absolute inset-0 group-hover:bg-indigo-50 pointer-events-none transition-colors"></div><input type="number" placeholder="-" value={prices[`${petType}_${type.id}_${weightIdx}`] || ''} onChange={(e) => handlePriceChange(type.id, weightIdx, e.target.value)} className="w-full h-full p-3 text-center outline-none bg-transparent relative z-10 focus:bg-indigo-50 focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-all text-sm font-medium text-gray-800 placeholder-gray-300"/></td>))}</tr>))}</tbody>
                    </table>
                </div>
                <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-4"><input type="password" inputMode="numeric" value={ownerPin} onChange={(e) => setOwnerPin(e.target.value)} placeholder="Owner PIN" className={`pl-4 pr-4 py-2.5 border rounded-xl outline-none w-48 transition font-mono tracking-widest text-center ${isPinError ? 'border-red-300 bg-red-50 text-red-900 focus:ring-red-200' : 'border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200'}`}/>{feedback.message && (<div className={`flex items-center gap-1 text-sm font-bold animate-in slide-in-from-left-2 fade-in ${feedback.type === 'error' ? 'text-red-500' : 'text-green-500'}`}><AlertCircle size={14} /> {feedback.message}</div>)}</div>
                    <div className="flex gap-3"><button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">ยกเลิก</button><button type="button" onClick={handleConfirmSetup} className={`px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition flex items-center gap-2 transform active:scale-95 ${!ownerPin ? 'bg-gray-400 cursor-not-allowed opacity-70' : 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 shadow-indigo-200'}`}><Save size={18} /> {ownerPin ? `ยืนยัน (${petType === 'dog' ? 'สุนัข' : 'แมว'})` : 'กรุณาใส่รหัส PIN'}</button></div>
                </div>
             </div>
        </div>
    );
};


// --- NEW Tag Input Component ---
const TagInput = ({ tags, onAdd, onRemove, label, type, placeholder }) => {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && inputValue.trim() !== '') {
            e.preventDefault();
            onAdd(type, inputValue.trim());
            setInputValue('');
        }
    };

    const TagIcon = type === 'dog' ? Dog : type === 'cat' ? Cat : Scissors;
    const tagBg = type === 'dog' ? 'bg-indigo-100 text-indigo-700' : type === 'cat' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700';

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">{label}</label>
            <div className="flex flex-wrap gap-2 min-h-[40px] items-center p-3 border border-gray-200 rounded-xl bg-gray-50/50">
                {tags.map((tag, index) => (
                    <span key={index} className={`px-3 py-1 ${tagBg} rounded-full text-sm font-medium flex items-center gap-1`}>
                        <TagIcon size={12} />
                        {tag}
                        <button onClick={() => onRemove(type, tag)} className="text-current opacity-50 hover:opacity-100 transition"><X size={12} /></button>
                    </span>
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="flex-1 min-w-[100px] bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
                />
            </div>
             <p className="text-xs text-gray-400">กด Enter เพื่อเพิ่ม Tag</p>
        </div>
    );
};

const SkillStatBar = ({ label, score }) => {
    const width = `${(score / 5) * 100}%`;
    const color = score >= 4.5 ? 'bg-emerald-500' : score >= 4.0 ? 'bg-yellow-500' : 'bg-red-500';
    
    return (
        <div className="flex items-center gap-4 text-sm">
            <span className="w-24 font-medium text-gray-600">{label}</span>
            <div className="flex-1">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${color} transition-all duration-500`} style={{ width }}></div>
                </div>
            </div>
            <span className="w-8 font-bold text-gray-800 text-right">{score.toFixed(1)}</span>
        </div>
    );
};

const getGroomerMainExpertise = (expertise) => {
    if (expertise.dog.length > 0) return { icon: Dog, type: 'สุนัข', color: 'bg-indigo-500' };
    if (expertise.cat.length > 0) return { icon: Cat, type: 'แมว', color: 'bg-pink-500' };
    if (expertise.other.length > 0) return { icon: Scissors, type: 'พิเศษ', color: 'bg-teal-500' };
    return { icon: PawPrint, type: 'ทั่วไป', color: 'bg-gray-500' };
}

// Utility to get Pet Icon
const getPetIcon = (type) => {
    switch (type) {
        case 'dog': return Dog;
        case 'cat': return Cat;
        case 'rabbit': return Rabbit;
        case 'bird': return Bird;
        case 'fish': return Fish;
        default: return PawPrint;
    }
};

const GroomerSelectionCard = ({ groomer, onClick }) => {
    const expertise = getGroomerMainExpertise(groomer.expertise);
    
    // Mock Availability for visual feedback
    // Note: G01=Available, G02=Booked Up, G03=Off Day (for visual representation)
    const mockStatus = {
        'G01': { text: 'Available (ว่าง)', color: 'bg-emerald-600', icon: CheckCircle2 }, // แนน
        'G02': { text: 'Booked Up (เต็ม)', color: 'bg-orange-500', icon: Clock },    // บอย
        'G03': { text: 'Off Day (วันหยุด)', color: 'bg-gray-400', icon: Ban },      // ก้อย
    }[groomer.id] || { text: 'Available (ว่าง)', color: 'bg-emerald-600', icon: CheckCircle2 };

    return (
        <div 
            onClick={() => onClick(groomer)} 
            className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 cursor-pointer hover:shadow-2xl hover:border-indigo-400 transition transform hover:scale-[1.02] group relative overflow-hidden"
        >
            {/* Top Right Status Badge */}
            <div className={`absolute top-0 right-0 rounded-bl-xl rounded-tr-2xl px-4 py-1.5 text-xs font-bold text-white flex items-center gap-1 ${mockStatus.color}`}>
                <mockStatus.icon size={14} />
                {mockStatus.text}
            </div>
            
            <div className="flex items-center gap-6 mb-4">
                {/* Image */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-md flex-shrink-0">
                    <img src={groomer.image} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" alt={groomer.name} />
                </div>
                
                {/* Info */}
                <div>
                    <h3 className={`${FONTS.header} text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition leading-tight`}>
                        {groomer.name} <span className="text-base font-medium text-gray-500">({groomer.nickname})</span>
                    </h3>
                    <div className="flex items-center gap-1 text-yellow-500 font-bold mt-1">
                        <Star size={16} fill="currentColor"/> 
                        <span className="text-lg">{groomer.rating}</span> 
                        <span className="text-xs text-gray-500 ml-1">({groomer.reviewsCount} reviews)</span>
                    </div>
                </div>
            </div>
            
            {/* Specialty Tag & Bio Snippet */}
            <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 w-fit ${expertise.color}`}>
                    <expertise.icon size={12}/> 
                    ความถนัด: {expertise.type}
                </span>
            </div>

            <p className="text-sm text-gray-600 italic border-l-4 border-gray-200 pl-3 pt-1 pb-1 mb-4 h-16 line-clamp-3">
                "{groomer.bio.substring(0, 100)}..."
            </p>

            {/* Bottom Actions/Details */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 font-medium">ตารางงาน: {groomer.schedule}</p>
                <span className="text-indigo-600 font-bold text-sm flex items-center gap-1 hover:underline">
                    View Profile <ChevronRight size={14} />
                </span>
            </div>
        </div>
    );
};


const GroomerDetail = ({ groomer, onBack }) => {
    const [activeTab, setActiveTab] = useState('profile');
    
    // Use state for editable data (deep copy initial data for isolated editing)
    const [currentBio, setCurrentBio] = useState(groomer.bio);
    const [currentExpertise, setCurrentExpertise] = useState(JSON.parse(JSON.stringify(groomer.expertise))); 
    const [currentBasicData, setCurrentBasicData] = useState({
        name: groomer.name,
        nickname: groomer.nickname,
        commissionRate: groomer.commissionRate,
        schedule: groomer.schedule,
    });
    // NEW: State for mock pin management
    const [currentPinnedIds, setCurrentPinnedIds] = useState(groomer.pinnedReviewIds);
    
    // State for Secure Transfer Mock
    const [ownerPinInput, setOwnerPinInput] = useState('');
    const [staffPinInput, setStaffPinInput] = useState('');
    const [transferStatus, setTransferStatus] = useState({ message: '', type: '' });
    
    const [isAILoading, setIsAILoading] = useState(false);
    
    if (!groomer) return null;

    // Handlers for Expertise Tags
    const handleAddTag = (type, tag) => {
        setCurrentExpertise(prev => {
            if (!prev[type].includes(tag)) {
                return { ...prev, [type]: [...prev[type], tag] };
            }
            return prev;
        });
    };

    const handleRemoveTag = (type, tag) => {
        setCurrentExpertise(prev => ({
            ...prev,
            [type]: prev[type].filter(t => t !== tag)
        }));
    };
    
    // Handler for AI Bio Generation (Mocking API call)
    const handleAIBioGenerate = (style) => {
        setIsAILoading(true);
        // Simulate API delay
        setTimeout(() => {
            const newBio = generateAIBio(style, groomer);
            setCurrentBio(newBio);
            setIsAILoading(false);
        }, 1500);
    }
    
    // NEW: Handler for Pinning/Unpinning
    const handlePinToggle = (reviewId) => {
        setCurrentPinnedIds(prev => {
            if (prev.includes(reviewId)) {
                // Unpin
                return prev.filter(id => id !== reviewId);
            } else {
                // Pin (Max 3)
                if (prev.length < 3) {
                    return [...prev, reviewId];
                }
                return prev; // Do nothing if max reached
            }
        });
    };
    
    // Mock Secure Transfer Handler
    const handleSecureTransfer = (e) => {
        e.preventDefault();
        setTransferStatus({ message: '', type: '' });

        if (ownerPinInput === SYSTEM_DEFAULTS.ownerPIN && staffPinInput === groomer.staffPIN) {
            setTransferStatus({ message: `ยืนยันการโอนย้ายประวัติสำเร็จ! ประวัติการทำงานจะถูกลบออกจากฐานข้อมูลร้าน`, type: 'success' });
            setOwnerPinInput('');
            setStaffPinInput('');
            // In a real application, you would perform the data migration/deletion here.
        } else {
            setTransferStatus({ message: 'รหัส PIN ไม่ถูกต้อง กรุณาลองอีกครั้ง', type: 'error' });
        }
    };
    
    // Fetch pinned reviews (mocked)
    const pinnedReviews = currentPinnedIds.map(id => getReviewData(id)).filter(r => r);
    
    const handleBasicDataChange = (field, value) => {
        setCurrentBasicData(prev => ({ ...prev, [field]: value }));
    };
    
    const handleSaveSettings = () => {
        // Mock saving data
        console.log("Saving Groomer Settings:", {
            ...currentBasicData,
            bio: currentBio,
            expertise: currentExpertise,
            pinnedReviewIds: currentPinnedIds // Include updated pinned IDs
        });
        // In a real app, this would trigger a state update for GROOMERS or a database save.
    };

    const tenure = calculateTenure(groomer.joinDate);


    return (
        <div className="h-full flex flex-col bg-gray-50">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start sticky top-0 z-20 shadow-md">
                <div className="flex items-center gap-6">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-800"><ArrowLeft /></button>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-lg"><img src={groomer.image} className="w-full h-full object-cover" alt={groomer.name} /></div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className={`${FONTS.header} text-2xl font-bold text-gray-900`}>{currentBasicData.name}</h2>
                            {groomer.reviewsCount > 50 && (<span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full border border-indigo-200 font-bold flex items-center gap-1"><Award size={12} /> Top Groomer</span>)}
                        </div>
                        <p className="text-gray-500 font-medium mb-3">"{currentBasicData.nickname}"</p>
                        <div className="flex gap-2">{groomer.awards.map((award, i) => (<span key={i} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-1 rounded border border-yellow-200 font-bold flex items-center gap-1"><Trophy size={12} className="fill-yellow-500 text-yellow-500" /> {award}</span>))}</div>
                    </div>
                </div>
                <div className="flex gap-2 p-2 bg-gray-100 rounded-xl">
                    <button onClick={()=>setActiveTab('profile')} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab==='profile' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>Profile (ข้อมูล)</button>
                    <button onClick={()=>setActiveTab('settings')} className={`px-4 py-2 rounded-lg font-bold text-sm transition ${activeTab==='settings' ? 'bg-white text-gray-900 shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>Settings (แก้ไข)</button>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'profile' ? (
                    <div className="grid grid-cols-12 gap-8">
                        {/* Column 1 (Left) */}
                        <div className="col-span-4 space-y-6">
                             {/* Bio / Self-Introduction */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><MessageCircle size={18} className="text-indigo-500"/> แนะนำตัว</h3>
                                <p className="text-gray-600 italic leading-relaxed text-sm">{currentBio}</p>
                            </div>

                             {/* Skill Visualization Block */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><Hexagon size={18} className="text-yellow-500"/> คะแนนความสามารถเฉลี่ย (จากรีวิว)</h3>
                                <div className="space-y-4">
                                    <SkillStatBar label="ความสวยงาม" score={groomer.stats.beauty} />
                                    <SkillStatBar label="ความเรียบร้อย" score={groomer.stats.neatness} />
                                    <SkillStatBar label="ความใส่ใจ" score={groomer.stats.care} />
                                    <SkillStatBar label="ความรวดเร็ว" score={groomer.stats.speed} />
                                    <SkillStatBar label="บริการ" score={groomer.stats.service} />
                                </div>
                                <h3 className="font-bold text-gray-800 mt-6 mb-3 flex items-center gap-2 border-t pt-4"><Tag size={18} className="text-teal-500"/> ความถนัด</h3>
                                <div className="flex flex-wrap gap-2">
                                    {currentExpertise.dog.map((skill, i) => (<span key={`d-${i}`} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium flex items-center gap-1"><Dog size={12}/>{skill}</span>))}
                                    {currentExpertise.cat.map((skill, i) => (<span key={`c-${i}`} className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-sm font-medium flex items-center gap-1"><Cat size={12}/>{skill}</span>))}
                                    {currentExpertise.other.map((skill, i) => (<span key={`o-${i}`} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium flex items-center gap-1"><Scissors size={12}/>{skill}</span>))}
                                </div>
                            </div>
                        </div>

                        {/* Column 2 (Right) */}
                        <div className="col-span-8 space-y-6">
                            {/* Staff Info: Tenure, Qualification, Work History */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Briefcase size={18} className="text-green-600"/> ประวัติการทำงานและคุณวุฒิ</h3>
                                
                                {/* Tenure and Qualifications */}
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                                        <p className="text-xs text-green-700 font-bold mb-1 flex items-center gap-1"><Clock size={14}/> อายุงานที่ร้าน</p>
                                        <p className="font-extrabold text-2xl text-green-800">{tenure}</p>
                                        <p className="text-xs text-gray-500 mt-1">วันที่เริ่มงาน: {new Date(groomer.joinDate).toLocaleDateString('th-TH')}</p>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                        <p className="text-xs text-blue-700 font-bold mb-1 flex items-center gap-1"><ShieldCheck size={14}/> วุฒิบัตรช่าง</p>
                                        {groomer.qualifications.map((q, i) => (
                                            <p key={i} className="text-sm text-blue-800 font-medium">{q}</p>
                                        ))}
                                    </div>
                                </div>
                                
                                {/* External Work History */}
                                <p className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-1 border-t pt-3"><History size={16}/> ประวัติการทำงานภายนอก</p>
                                <div className="space-y-3">
                                    {groomer.workHistory.map((history, i) => (
                                        <div key={i} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-lg">
                                            <div className="font-bold text-gray-800">{history.employer}</div>
                                            <div className="text-right">
                                                <p className="text-gray-600 font-medium">{history.role}</p>
                                                <p className="text-xs text-gray-400">{history.year}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            {/* Pinned Reviews */}
                            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Star size={18} className="text-yellow-500 fill-yellow-500"/> รีวิวปักหมุด (Pinned Reviews - Max 3)</h3>
                                <div className="space-y-3">
                                    {pinnedReviews.length > 0 ? (
                                        pinnedReviews.map((review, i) => (
                                            <div key={review.id} className="p-4 border border-yellow-200 bg-yellow-50/50 rounded-xl flex items-start gap-4 shadow-sm">
                                                <div className="text-yellow-500 flex-shrink-0"><CheckCircle size={20} fill="currentColor" /></div>
                                                <div className="flex-1">
                                                     <p className="text-sm text-gray-600 italic mb-1">"{review.text}"</p>
                                                     <p className="text-xs font-bold text-gray-700">- {review.ownerName} (Pet: {review.petName})</p>
                                                </div>
                                                {/* Mock Unpin button, real implementation would require state/data logic */}
                                                <button title="Unpin" className="text-red-400 hover:text-red-600 transition" onClick={() => handlePinToggle(review.id)}><Trash2 size={16}/></button>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center p-4 text-gray-400 border border-dashed rounded-xl">ไม่มีรีวิวปักหมุด</div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Work History (Original Block) */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2"><History size={18}/> Work History (In-house)</h3>
                                <div className="space-y-4">{[1,2,3].map(i => (<div key={i} className="flex justify-between items-center p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-2xl">🐩</div><div><p className="font-bold text-gray-800">น้องมอมแมม (Poodle)</p><p className="text-xs text-gray-500">ตัดขนทรงมาตรฐาน • 12/12/2023</p></div></div><div className="text-right"><div className="flex text-yellow-400 mb-1"><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/><Star size={12} fill="currentColor"/></div><p className="text-xs text-gray-400">"ช่างมือเบามากค่ะ"</p></div></div>))}</div>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Settings Tab: Editing */
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Basic Settings Block */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                            <h3 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-3"><Edit2 size={24}/> ข้อมูลพื้นฐานและค่าคอมมิชชั่น</h3>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div><label className="block text-sm font-bold text-gray-700 mb-2">ชื่อช่าง</label><input type="text" value={currentBasicData.name} onChange={(e) => handleBasicDataChange('name', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-2">ชื่อเล่น (Nickname)</label><input type="text" value={currentBasicData.nickname} onChange={(e) => handleBasicDataChange('nickname', e.target.value)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-2">Commission Rate (%)</label><input type="number" value={currentBasicData.commissionRate} onChange={(e) => handleBasicDataChange('commissionRate', parseFloat(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200" /></div>
                                <div><label className="block text-sm font-bold text-gray-700 mb-2">Working Schedule</label><input type="text" value={currentBasicData.schedule} onChange={(e) => handleBasicDataChange('schedule', e.target.value)} placeholder="เช่น Mon-Fri, Weekend Only" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200" /></div>
                            </div>
                        </div>
                        
                        {/* Secure Work History Transfer Block (NEW) */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-red-100 space-y-6">
                            <h3 className="font-bold text-2xl text-red-700 mb-6 flex items-center gap-3"><Power size={24}/> โอนย้ายประวัติการทำงาน (Secure Transfer)</h3>
                            <p className="text-sm text-gray-600">ฟังก์ชันนี้ใช้สำหรับลบและโอนย้ายประวัติการทำงานทั้งหมดของช่างออกจากฐานข้อมูล เมื่อพนักงานลาออก ต้องใช้ **รหัส PIN ของเจ้าของร้าน** และ **รหัส PIN ของพนักงาน** เพื่อยืนยัน</p>
                            
                            <form onSubmit={handleSecureTransfer} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><Lock size={16}/> Owner PIN (Mock: {SYSTEM_DEFAULTS.ownerPIN})</label>
                                        <input 
                                            type="password" 
                                            inputMode="numeric"
                                            value={ownerPinInput}
                                            onChange={(e) => { setOwnerPinInput(e.target.value); setTransferStatus({ message: '', type: '' }); }}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-200 text-center font-mono tracking-widest" 
                                            maxLength={4}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-1"><Unlock size={16}/> Staff PIN (Mock: {groomer.staffPIN})</label>
                                        <input 
                                            type="password" 
                                            inputMode="numeric"
                                            value={staffPinInput}
                                            onChange={(e) => { setStaffPinInput(e.target.value); setTransferStatus({ message: '', type: '' }); }}
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-200 text-center font-mono tracking-widest" 
                                            maxLength={4}
                                        />
                                    </div>
                                </div>
                                
                                {transferStatus.message && (
                                    <div className={`p-3 rounded-xl text-sm font-bold flex items-center gap-2 ${transferStatus.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                        <AlertCircle size={16} /> {transferStatus.message}
                                    </div>
                                )}
                                
                                <button 
                                    type="submit"
                                    className="w-full py-3 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center justify-center gap-2 transform active:scale-95"
                                >
                                    <Trash2 size={18} /> ยืนยันการลบและโอนย้ายประวัติ
                                </button>
                            </form>
                        </div>

                        {/* AI Bio Generation & Editing */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                            <h3 className="font-bold text-2xl text-gray-800 mb-6 flex items-center gap-3"><MessageSquare size={24} className="text-emerald-600"/> คำแนะนำตัว (AI Generator)</h3>
                            
                            <textarea 
                                value={currentBio}
                                onChange={(e) => setCurrentBio(e.target.value)}
                                rows="4" 
                                placeholder="พิมพ์ข้อความแนะนำตัวของคุณเอง หรือใช้ AI ช่วยสร้าง..." 
                                className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 text-sm italic"
                            />
                            
                            <div className="space-y-3">
                                <label className="block text-sm font-bold text-gray-700">สร้างด้วย AI (ไม่เกิน 4 ประโยค)</label>
                                <div className="flex flex-wrap gap-3">
                                    <button 
                                        onClick={() => handleAIBioGenerate('genz')} 
                                        disabled={isAILoading}
                                        className="flex-1 min-w-[150px] py-2.5 rounded-xl bg-pink-100 text-pink-700 border border-pink-200 font-bold hover:bg-pink-200 transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {isAILoading ? <RefreshCw size={16} className='animate-spin inline mr-2'/> : 'Gen Z Style'}
                                    </button>
                                    <button 
                                        onClick={() => handleAIBioGenerate('luxury')} 
                                        disabled={isAILoading}
                                        className="flex-1 min-w-[150px] py-2.5 rounded-xl bg-yellow-100 text-yellow-700 border border-yellow-200 font-bold hover:bg-yellow-200 transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {isAILoading ? <RefreshCw size={16} className='animate-spin inline mr-2'/> : 'หรูหรา (Luxury)'}
                                    </button>
                                    <button 
                                        onClick={() => handleAIBioGenerate('friendly')} 
                                        disabled={isAILoading}
                                        className="flex-1 min-w-[150px] py-2.5 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold hover:bg-emerald-200 transition disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed"
                                    >
                                        {isAILoading ? <RefreshCw size={16} className='animate-spin inline mr-2'/> : 'เป็นกันเอง (Friendly)'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Skill Tag Editing */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 space-y-6">
                            <h3 className="font-bold text-2xl text-gray-800 flex items-center gap-3"><Tag size={24} className="text-teal-600"/> ความถนัดและความเชี่ยวชาญ</h3>
                            
                            <TagInput 
                                label={<><Dog size={16} className="inline mr-1"/>ความถนัดด้านสุนัข (Dog Expertise)</>}
                                tags={currentExpertise.dog}
                                onAdd={handleAddTag}
                                onRemove={handleRemoveTag}
                                type="dog"
                                placeholder="เช่น Poodle, Shih Tzu, Golden Retriever"
                            />
                            
                            <TagInput 
                                label={<><Cat size={16} className="inline mr-1"/>ความถนัดด้านแมว (Cat Expertise)</>}
                                tags={currentExpertise.cat}
                                onAdd={handleAddTag}
                                onRemove={handleRemoveTag}
                                type="cat"
                                placeholder="เช่น แมวขนสั้น, แมวดุ"
                            />

                            <TagInput 
                                label={<><Scissors size={16} className="inline mr-1"/>ความเชี่ยวชาญพิเศษอื่นๆ</>}
                                tags={currentExpertise.other}
                                onAdd={handleAddTag}
                                onRemove={handleRemoveTag}
                                type="other"
                                placeholder="เช่น ทำสีขน, สปาพรีเมียม, งานไถ"
                            />

                             <div className="pt-4 border-t border-gray-100">
                                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2"><Star size={18} className="text-yellow-500 fill-yellow-500"/> ปักหมุดรีวิว (Mockup)</h3>
                                <p className="text-sm text-gray-500 mb-3">คุณสามารถเลือกปักหมุดรีวิวที่ดีที่สุด 3 อันเพื่อให้ลูกค้าเห็นในหน้า Profile (ปัจจุบันปักหมุดแล้ว {currentPinnedIds.length}/3)</p>
                                <div className="flex flex-wrap gap-2">
                                    {REVIEWS.map(r => { // Updated
                                        const isPinned = currentPinnedIds.includes(r.id);
                                        const isDisabled = !isPinned && currentPinnedIds.length >= 3;
                                        return (
                                        <button 
                                            key={r.id} 
                                            title={r.text}
                                            onClick={() => handlePinToggle(r.id)}
                                            disabled={isDisabled}
                                            className={`px-3 py-1 text-xs border rounded-full transition flex items-center gap-1 ${
                                                isPinned 
                                                ? 'bg-yellow-500 text-white font-bold hover:bg-yellow-600' 
                                                : isDisabled 
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                        >
                                            {isPinned ? <Check size={14} /> : <Plus size={14} />} {r.petName} ({r.rating} ดาว)
                                        </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        
                        {/* Save Button */}
                        <div className="flex justify-end pt-4">
                            <button 
                                onClick={handleSaveSettings} 
                                className="px-8 py-3 rounded-xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition flex items-center gap-2 transform active:scale-95"
                            >
                                <Save size={18} /> บันทึกการตั้งค่าทั้งหมด
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * Renders a compact card for a single client, highlighting their loyalty level and associated pets.
 * @param {object} client - The client data object from INITIAL_MEMBERS_DB.
 * @param {function} onViewDetails - Handler for viewing client details.
 */
const ClientCard = ({ client, onViewDetails }) => {
    // Get pet data associated with this client
    const pets = useMemo(() => getPetByOwner(client.id), [client.id]);

    const PetIcons = useMemo(() => {
        // Collect unique pet types for display
        const uniquePetTypes = [...new Set(pets.map(p => p.type))].slice(0, 3);
        return uniquePetTypes.map((type, index) => {
            const Icon = getPetIcon(type);
            return (
                // Enhanced visual style for the pet icons
                <div key={index} title={type} className={`w-8 h-8 rounded-full bg-white ring-2 ring-indigo-200 shadow-lg flex items-center justify-center text-gray-800 border border-gray-200 shrink-0 ${index > 0 ? '-ml-3' : ''}`}>
                    <Icon size={16} className={`text-indigo-600`} />
                </div>
            );
        });
    }, [pets]);

    return (
        <div 
            // Enhanced Card Styling
            className={`bg-white rounded-2xl shadow-xl border border-gray-100 p-6 flex flex-col justify-between cursor-pointer transition-all transform hover:scale-[1.01] hover:shadow-2xl hover:border-indigo-400 group`}
            onClick={() => onViewDetails(client.id)} 
        >
            {/* Top Section: Name and Loyalty Level */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h4 className={`${FONTS.header} text-xl font-extrabold text-gray-900 group-hover:text-indigo-600 transition leading-tight`}>
                        {client.name}
                    </h4>
                    <p className="text-sm text-gray-500 mt-0.5">{client.phone}</p>
                </div>
                {/* Loyalty Level Badge */}
                <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${client.levelColor} shadow-sm`}>
                    {client.level}
                </span>
            </div>

            {/* Mid Section: Stats and Pets */}
            <div className="space-y-3">
                {/* Pet Avatars/Icons */}
                <div className="flex items-center pt-2 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-700 mr-3 flex-shrink-0">สัตว์เลี้ยง ({pets.length}):</p>
                    <div className="flex -space-x-3">
                        {PetIcons}
                        {pets.length > 3 && (
                            <span className="w-8 h-8 rounded-full bg-gray-200 ring-2 ring-gray-300 flex items-center justify-center text-xs text-gray-600 shadow-md border border-gray-300">
                                +{pets.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 text-sm pt-2">
                    <div className="flex items-center gap-2 text-indigo-700 font-bold">
                        <Coins size={16} />
                        <span className="text-gray-500 font-medium">Points:</span>
                        <span className="text-indigo-600">{client.points.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-700 font-bold">
                        <List size={16} />
                        <span className="text-gray-500 font-medium">Visits:</span>
                        <span className="text-emerald-600">{client.visits}</span>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Action */}
            <div className="mt-4 pt-4 border-t border-gray-100">
                <button className="w-full text-indigo-600 font-bold text-sm flex items-center justify-center gap-2 group-hover:bg-indigo-50 py-2 rounded-lg transition">
                    <FileText size={16} /> ดูประวัติโดยละเอียด
                </button>
            </div>
        </div>
    );
};

// NEW COMPONENT: Client List View (Tabular)
const ClientList = ({ clients, onViewDetails }) => {
    
    // Helper to get pet types string
    const getPetTypes = (petIds) => {
        const pets = petIds.map(id => getPetData(id)).filter(p => p);
        const uniqueTypes = [...new Set(pets.map(p => p.type))];
        return uniqueTypes.map(t => t.charAt(0).toUpperCase() + t.slice(1)).join(', ');
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[200px]">ลูกค้า (Owner)</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[150px]">ระดับสมาชิก</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">Points</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[120px]">Visits</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider min-w-[180px]">Pet Types</th>
                            <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {clients.map((client, index) => (
                            <tr key={client.id} className={index % 2 === 0 ? 'bg-white hover:bg-indigo-50/50 transition-colors' : 'bg-gray-50/50 hover:bg-indigo-50/50 transition-colors'}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold border border-indigo-200">
                                            {client.name.substring(0, 1)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-bold text-gray-900">{client.name}</div>
                                            <div className="text-xs text-gray-500">{client.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap ${client.levelColor} shadow-sm`}>
                                        {client.level}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                                    {client.points.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                                    {client.visits}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {getPetTypes(client.petIds)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => onViewDetails(client.id)}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold text-xs flex items-center gap-1 justify-end float-right"
                                    >
                                        <FileText size={16} /> View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Service Management Modal (Restored) ---
const ServiceModal = ({ isOpen, onClose, onSave, service }) => {
    const isEditing = !!service;
    const initialForm = {
        id: service?.id || null,
        name: service?.name || '',
        duration: service?.duration || 60,
        price: service?.price || 0,
        type: service?.type || 'dog', // dog, cat, spa
        category: service?.category || 'Bath', // Bath, Cut, Spa, Other
        weightRangeIdx: service?.weightRangeIdx || -1, // -1 means All sizes
        note: service?.note || '', // Placeholder for service-specific notes
    };

    const [formData, setFormData] = useState(initialForm);

    useEffect(() => {
        setFormData(initialForm);
    }, [service]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        let newValue = value;
        if (name === 'duration' || name === 'price' || name === 'weightRangeIdx') {
            newValue = parseFloat(value) || 0;
        }

        setFormData(prev => ({ ...prev, [name]: newValue }));
        
        // Auto-set category based on type (simple logic for mockup)
        if (name === 'type') {
            if (value === 'spa') setFormData(prev => ({ ...prev, category: 'Spa' }));
            else if (prev.category === 'Spa') setFormData(prev => ({ ...prev, category: 'Bath' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Basic validation
        if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
            console.error("Please fill in required fields correctly.");
            return;
        }
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
             <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-gray-100">
                    <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}>
                        <Tag size={24} className="text-teal-600"/> {isEditing ? 'แก้ไขรายการบริการ' : 'เพิ่มรายการบริการใหม่'}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">ชื่อบริการ (Service Name) <span className="text-red-500">*</span></label>
                        <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="เช่น อาบน้ำ - สุนัขเล็ก, ตัดขนแมวใหญ่"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200"
                            required
                        />
                    </div>

                    {/* Type, Category, Price, Duration */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700">ประเภทสัตว์</label>
                            <select 
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-200"
                            >
                                <option value="dog">สุนัข (Dog)</option>
                                <option value="cat">แมว (Cat)</option>
                                <option value="spa">สปา/บำรุง</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">หมวดหมู่</label>
                            <select 
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-200"
                            >
                                <option value="Bath">อาบน้ำ (Bath)</option>
                                <option value="Cut">ตัดขน (Cut)</option>
                                <option value="Spa">สปา/บำรุง (Spa)</option>
                                <option value="Other">อื่นๆ</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                         <div>
                            <label className="block text-sm font-bold text-gray-700">ราคา ({SYSTEM_DEFAULTS.currencySymbol}) <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                name="price"
                                inputMode="decimal"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 text-right font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">ระยะเวลา (นาที) <span className="text-red-500">*</span></label>
                            <input 
                                type="number" 
                                name="duration"
                                inputMode="numeric"
                                value={formData.duration}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 text-right font-mono"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700">ช่วงน้ำหนัก</label>
                            <select 
                                name="weightRangeIdx"
                                value={formData.weightRangeIdx}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-teal-200 text-sm"
                            >
                                <option value={-1}>--- ทุกขนาด (All Sizes) ---</option>
                                {WEIGHT_RANGES.map((r, i) => (
                                    <option key={i} value={i}>{r}</option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-1">ตั้งค่าเพื่อกรองการจอง</p>
                        </div>
                    </div>

                    {/* Notes */}
                     <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">หมายเหตุ/รายละเอียด</label>
                        <textarea 
                            name="note"
                            value={formData.note}
                            onChange={handleChange}
                            rows="2"
                            placeholder="รายละเอียดเพิ่มเติมสำหรับบริการนี้ (เช่น การใช้แชมพูพิเศษ)"
                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-200 text-sm"
                        />
                    </div>
                </form>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">ยกเลิก</button>
                    <button 
                        type="submit" 
                        onClick={handleSubmit} 
                        className="px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition flex items-center gap-2 transform active:scale-95 bg-teal-600 shadow-teal-200 hover:bg-teal-700"
                    >
                        <Save size={18} /> {isEditing ? 'บันทึกการแก้ไข' : 'เพิ่มบริการ'}
                    </button>
                </div>
            </div>
        </div>
    );
};


const MemberSearchModal = ({ isOpen, onClose, onSelectMember, currentMemberId }) => {
    const [query, setQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        const fetchMembers = () => {
            // Regex fix: removed /g from the inline regex in replace() if it was there before.
            const normalizedQuery = query.toLowerCase().replace(/-/g, ''); 
            let results = [];

            if (query.length > 0) {
                 results = INITIAL_MEMBERS_DB.filter(m => {
                    if (m.id === '000') return false; // Exclude general customer

                    // Search by Member Name or Phone (normalized)
                    const memberMatch = m.name.toLowerCase().includes(normalizedQuery) || 
                                        m.phone.replace(/-/g, '').includes(normalizedQuery);

                    // Search by Pet Name
                    const petMatch = m.petIds.some(petId => {
                        const pet = getPetData(petId);
                        return pet && pet.name.toLowerCase().includes(normalizedQuery);
                    });

                    return memberMatch || petMatch;
                });
            } else {
                 // If no query, show top members (excluding general customer)
                 results = INITIAL_MEMBERS_DB.filter(m => m.id !== '000').slice(0, 10);
            }
            setFilteredMembers(results);
        };

        fetchMembers();
    }, [query]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] transform scale-100 transition-transform duration-300">
                <div className="p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ค้นหาลูกค้า/สัตว์เลี้ยง</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><X size={20} /></button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="ค้นหาด้วยชื่อลูกค้า, เบอร์โทร, หรือชื่อสัตว์เลี้ยง..." 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-200 font-medium transition" 
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-2">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(m => (
                            <div 
                                key={m.id} 
                                onClick={() => onSelectMember(m.id)}
                                className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                                    currentMemberId === m.id 
                                        ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-200' 
                                        : 'bg-white border-gray-100 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <UserCheck size={20} className={currentMemberId === m.id ? 'text-indigo-600' : 'text-gray-500'}/>
                                    <div>
                                        <p className="font-bold text-base text-gray-900">{m.name}</p>
                                        <p className="text-sm text-gray-500">{m.phone}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${m.levelColor}`}>{m.level}</span>
                                    <p className="text-sm text-gray-500">{m.petIds.length} Pets</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-10 text-gray-400">
                            <AlertCircle size={32} className="mx-auto mb-3" />
                            <p>ไม่พบลูกค้าที่ตรงกับคำค้นหา</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100">
                     <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-200 transition flex items-center justify-center gap-2">
                        <Plus size={18} /> ลงทะเบียนลูกค้าใหม่
                    </button>
                </div>
            </div>
        </div>
    );
};

const PromotionConfirmationModal = ({ isOpen, onClose, onConfirm, summary }) => {
    if (!isOpen) return null;
    const { totalServicePrice, discountAmount, finalPrice, serviceCount } = summary;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col transform scale-100 transition-transform duration-300">
                <div className="p-6 border-b border-gray-100 text-center">
                    <Zap size={36} className="text-yellow-500 fill-yellow-500 mx-auto mb-3" />
                    <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>ยืนยันการทำรายการ</h2>
                    <p className="text-sm text-gray-500">ตรวจสอบรายการก่อนยืนยันการบันทึกนัดหมาย</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 text-blue-800">
                        <p className="font-bold flex items-center gap-2"><Trophy size={18} /> PROMOTION: ส่วนลด 10% (Mock)</p>
                        <p className="text-sm mt-1">ลูกค้าระดับ 'ก๊วนเพื่อนซี้' ได้รับส่วนลดทันที</p>
                    </div>

                    <div className="space-y-2 border-b border-gray-200 pb-4">
                        <div className="flex justify-between text-base text-gray-700"><span>จำนวนบริการ</span><span className="font-bold">{serviceCount} รายการ</span></div>
                        <div className="flex justify-between text-base text-gray-700"><span>ราคารวมบริการ</span><span className="font-bold">{totalServicePrice.toFixed(2)} {SYSTEM_DEFAULTS.currencySymbol}</span></div>
                        <div className="flex justify-between text-base text-red-600 font-bold"><span>ส่วนลดโปรโมชั่น (10%)</span><span>- {discountAmount.toFixed(2)} {SYSTEM_DEFAULTS.currencySymbol}</span></div>
                    </div>
                    
                    <div className="flex justify-between text-2xl text-indigo-700 font-extrabold">
                        <span>ยอดชำระสุทธิ</span>
                        <span>{finalPrice.toFixed(2)} {SYSTEM_DEFAULTS.currencySymbol}</span>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">แก้ไขต่อ</button>
                    <button onClick={onConfirm} className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition flex items-center gap-2 transform active:scale-95">
                        <Check size={18} /> ยืนยัน & บันทึก
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- NEW/MOCK MODALS FOR MULTI-PET FLOW ---

/**
 * Modal to select a pet from the member's list to add to the current appointment.
 */
const PetSelectionModal = ({ isOpen, onClose, memberPets, onSelectPet, selectedPetIds }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
                <div className="p-6 border-b border-gray-100">
                    <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}>
                        <PawPrint size={24} className="text-green-600"/> เลือกสัตว์เลี้ยงเข้ารับบริการ
                    </h2>
                    <p className="text-sm text-gray-500">เลือกสัตว์เลี้ยงที่คุณต้องการเพิ่มเข้าสู่การนัดหมายนี้</p>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                    {memberPets.length > 0 ? (
                        memberPets.map(pet => {
                            const PetIcon = getPetIcon(pet.type);
                            const isSelected = selectedPetIds.includes(pet.id);
                            
                            return (
                                <div 
                                    key={pet.id}
                                    onClick={() => onSelectPet(pet)}
                                    className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${
                                        isSelected
                                            ? 'bg-green-50 border-green-500 ring-2 ring-green-200 opacity-70 cursor-not-allowed'
                                            : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-indigo-300'
                                    }`}
                                >
                                    <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 bg-gray-100 mr-4 flex-shrink-0">
                                        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" onError={(e) => {e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/94a3b8/ffffff?text=PET';}} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-bold text-lg text-gray-900">{pet.name} <span className="text-sm font-normal text-gray-500">({pet.breed})</span></p>
                                        <p className="text-xs text-gray-500">
                                            น้ำหนัก: {pet.weight} kg ({WEIGHT_RANGES[getWeightRangeIndex(pet.weight)]})
                                        </p>
                                    </div>
                                    {isSelected ? (
                                        <CheckCircle2 size={24} className="text-green-600 flex-shrink-0" />
                                    ) : (
                                        <Plus size={24} className="text-indigo-500 flex-shrink-0" />
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center p-6 text-gray-400">
                            <AlertCircle size={32} className="mx-auto mb-3" />
                            <p>ไม่พบสัตว์เลี้ยงสำหรับลูกค้ารายนี้</p>
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">ปิด</button>
                </div>
            </div>
        </div>
    );
};

/**
 * Modal to select services specifically for a single pet.
 */
const PetServiceSelectionModal = ({ isOpen, onClose, pet, services, onSaveServices, petServices }) => {
    if (!isOpen || !pet) return null;

    const PetIcon = getPetIcon(pet.type);
    const petWeightRangeIdx = getWeightRangeIndex(pet.weight);
    
    // Internal state for services for this pet
    const [selectedServiceIds, setSelectedServiceIds] = useState(petServices.map(s => s.id));
    const [itemSearchQuery, setItemSearchQuery] = useState('');
    const [itemFilterType, setItemFilterType] = useState('grooming'); // Default to Grooming/Spa
    
    // --- Service Filtering Logic (Adapted from AppointmentModal) ---
    const filteredAvailableItems = useMemo(() => {
        let items = services.filter(item => item.isService); // Only show Services

        // Apply Search Filter
        if (itemSearchQuery) {
            const query = itemSearchQuery.toLowerCase();
            items = items.filter(item => item.name.toLowerCase().includes(query));
        }

        // Apply Category Filter (Grooming/Spa)
        if (itemFilterType !== 'all') {
             items = items.filter(item => {
                // Special handling for the main Grooming category which covers bath/cut/spa
                if (itemFilterType === 'grooming') return item.category !== 'Food' && item.category !== 'Retail Product';
                if (itemFilterType === 'spa' && item.category === 'Spa') return true;
                if (itemFilterType === 'products' && !item.isService) return true; // Show non-services if product tab is selected
                return false;
             });
        }
        
        // Apply Weight/Type Filter (Primary filter for the pet)
        items = items.filter(item => {
            // Check pet type compatibility (Dog/Cat/Spa)
            const petTypeMatch = item.serviceType === pet.type || item.serviceType === 'spa';
            if (!petTypeMatch) return false;

            // Check weight compatibility (if a range is specified for the service)
            const isCompatible = item.weightRangeIdx === -1 || item.weightRangeIdx === petWeightRangeIdx;

            return isCompatible;
        });
        
        // Sort by Category, then Price
        items.sort((a, b) => {
            const catOrder = a.category.localeCompare(b.category);
            if (catOrder !== 0) return catOrder;
            return a.price - b.price;
        });

        return items;
    }, [services, itemSearchQuery, itemFilterType, pet.type, petWeightRangeIdx]);

    const handleToggleService = (id) => {
        setSelectedServiceIds(prev => prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]);
    };
    
    // Mock History Items for Recommendations
    const petHistory = useMemo(() => CLIENT_HISTORY_MOCK
        .filter(h => h.petId === pet.id && h.isService)
        .slice(0, 3) // Show top 3 recent services
        .map(h => getItemDetails(h.itemId))
        .filter(i => i)
        , [pet.id]);
        
    const getServiceTypeColor = (item) => {
        if (item.category === 'Spa') return 'pink';
        if (item.type === 'dog') return 'indigo';
        if (item.type === 'cat') return 'purple';
        return 'teal';
    };

    const ServiceCard = ({ item }) => {
        const Icon = item.category === 'Spa' ? HeartPulse : Scissors;
        const isSelected = selectedServiceIds.includes(item.id);
        const color = getServiceTypeColor(item);
        
        return (
            <div 
                onClick={() => handleToggleService(item.id)}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                        ? `bg-${color}-600 border-${color}-600 text-white shadow-md`
                        : `bg-white border-gray-200 hover:border-${color}-300 text-gray-700 hover:bg-gray-50`
                }`}
            >
                <div className="flex items-center gap-3 w-3/4">
                    <Icon size={18} className={isSelected ? 'text-white fill-current' : `text-${color}-500`} />
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm truncate">{item.name}</p>
                        <span className={`text-xs ${isSelected ? 'opacity-80' : 'text-gray-500'}`}>
                            {item.duration} min | {item.category}
                        </span>
                    </div>
                </div>
                <span className={`font-bold text-right w-1/4 ${isSelected ? 'text-white' : `text-emerald-600`}`}>
                    {item.price.toFixed(0)} {SYSTEM_DEFAULTS.currencySymbol}
                </span>
            </div>
        );
    }
    
    const handleSave = () => {
        const newServices = selectedServiceIds.map(id => {
            const item = getItemDetails(id);
            return item ? { id, price: item.price, duration: item.duration, isService: item.isService } : null;
        }).filter(s => s);
        
        onSaveServices(pet.id, newServices);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95">
                
                {/* Header (Pet Info) */}
                <div className="p-6 border-b border-gray-100 bg-white rounded-t-2xl sticky top-0 z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-indigo-200 flex-shrink-0">
                            <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" onError={(e) => {e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/94a3b8/ffffff?text=PET';}} />
                        </div>
                        <div>
                            <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}>
                                <PetIcon size={24} className="text-indigo-600"/> {pet.name} <span className="text-base font-normal text-gray-500">({pet.breed})</span>
                            </h2>
                            <p className="text-sm text-gray-600">น้ำหนัก: {pet.weight} kg | ช่วง: <span className="font-bold text-indigo-500">{WEIGHT_RANGES[petWeightRangeIdx]}</span></p>
                        </div>
                    </div>
                </div>
                
                {/* Content: History / Service Selection */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 grid grid-cols-12 gap-6">
                    
                    {/* Left: Recommended/History (3/12) */}
                    <div className="col-span-12 lg:col-span-3 space-y-4">
                         <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 border-b pb-2"><History size={16}/> ประวัติการใช้บริการ (แนะนำ)</h3>
                         <div className="space-y-2">
                            {petHistory.length > 0 ? (
                                petHistory.map(item => (
                                    <div 
                                        key={item.id} 
                                        onClick={() => handleToggleService(item.id)}
                                        className={`p-3 rounded-lg border cursor-pointer transition text-xs flex justify-between items-center ${
                                            selectedServiceIds.includes(item.id) 
                                                ? 'bg-emerald-100 border-emerald-300 text-emerald-700 font-bold' 
                                                : 'bg-white border-gray-100 hover:bg-indigo-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Scissors size={14}/> {item.name}
                                        </div>
                                        {selectedServiceIds.includes(item.id) && <Check size={14}/>}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 p-2 border border-dashed rounded-lg text-center">ไม่พบรายการย้อนหลัง</p>
                            )}
                         </div>
                         <button className="text-sm text-indigo-600 font-bold flex items-center gap-1 hover:underline pt-2">ดูประวัติทั้งหมด <ChevronRight size={14}/></button>
                    </div>

                    {/* Right: Available Services (9/12) */}
                    <div className="col-span-12 lg:col-span-9 space-y-4">
                         <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2 border-b pb-2"><Tag size={16}/> รายการบริการทั้งหมด</h3>
                         
                         {/* Filters and Search */}
                         <div className="flex flex-wrap gap-2 items-center bg-gray-50 p-3 rounded-xl border border-gray-200">
                             <button
                                onClick={() => setItemFilterType('grooming')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm ${itemFilterType === 'grooming' ? 'bg-teal-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                             >
                                 <Scissors size={16} /> Grooming (อาบ/ตัด)
                             </button>
                             <button
                                onClick={() => setItemFilterType('spa')}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition flex items-center gap-2 shadow-sm ${itemFilterType === 'spa' ? 'bg-pink-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                             >
                                 <HeartPulse size={16} /> Spa (สปา)
                             </button>
                             <div className="relative flex-1 min-w-[200px] ml-auto">
                                 <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
                                 <input 
                                     type="text" 
                                     placeholder="ค้นหาบริการ..." 
                                     value={itemSearchQuery}
                                     onChange={(e) => setItemSearchQuery(e.target.value)}
                                     className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-teal-200 transition text-sm" 
                                 />
                             </div>
                         </div>

                        {/* Available Services Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[250px] max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                             {filteredAvailableItems.length > 0 ? (
                                 filteredAvailableItems.map(item => (
                                     <ServiceCard key={item.id} item={item} />
                                 ))
                             ) : (
                                 <div className="md:col-span-2 text-center p-10 text-gray-400">
                                     <AlertCircle size={32} className="mx-auto mb-3" />
                                     <p className="font-bold text-lg">ไม่พบรายการบริการที่เหมาะสม</p>
                                     <p className="text-sm">ลองเปลี่ยนประเภทบริการหรือตรวจสอบว่าได้ระบุน้ำหนัก/สายพันธุ์ถูกต้อง</p>
                                 </div>
                             )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 z-20 bg-white">
                    <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">ยกเลิก</button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        className="px-8 py-2.5 rounded-xl text-white font-bold shadow-lg transition flex items-center gap-2 transform active:scale-95 bg-teal-600 shadow-teal-200 hover:bg-teal-700"
                    >
                        <Save size={18} /> บันทึก ({selectedServiceIds.length} รายการ)
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- HELPER FUNCTION FOR APPOINTMENT MODAL (FIX) ---
/**
 * Helper function to create the internal state of selected pets and their services
 * based on the incoming appointment object, handling both new (petsWithServices)
 * and old (petId/serviceIds) structures.
 */
const createPetEntries = (appointment) => {
    // 1. Check for the new multi-pet structure (always prioritized after a save)
    if (appointment?.petsWithServices && appointment.petsWithServices.length > 0) {
        return appointment.petsWithServices.map(entry => ({
            petId: entry.petId,
            services: entry.serviceIds.map(id => {
                const item = getItemDetails(id);
                // Ensure service object structure is consistent for internal state
                return item ? { id, price: item.price, duration: item.duration, isService: item.isService } : null;
            }).filter(s => s),
            petData: getPetData(entry.petId)
        })).filter(entry => entry.petData); // Filter out entries where petData couldn't be found
    }

    // 2. Fallback for mock data (legacy structure)
    if (appointment?.petId) {
         return [{ 
            petId: appointment.petId, 
            services: (appointment.serviceIds || []).map(id => {
                const item = getItemDetails(id);
                return item ? { id, price: item.price, duration: item.duration, isService: item.isService } : null;
            }).filter(s => s),
            petData: getPetData(appointment.petId)
        }].filter(entry => entry.petData);
    }

    return [];
};

// --- MAIN APPOINTMENT MODAL (UPDATED) ---

const AppointmentModal = ({ isOpen, onClose, appointment, onSave, onDelete, services = ALL_SALES_ITEMS }) => {
    if (!isOpen) return null;
    
    const scrollRef = useRef(null);
    const [isFloatingInfoVisible, setIsFloatingInfoVisible] = useState(false);
    const [isMemberSearchOpen, setIsMemberSearchOpen] = useState(false);
    const [isPromotionConfirmOpen, setIsPromotionConfirmOpen] = useState(false);
    const [isPetSelectModalOpen, setIsPetSelectModalOpen] = useState(false);
    const [isServiceSelectModalOpen, setIsServiceSelectModalOpen] = useState(false);
    const [petForServiceModal, setPetForServiceModal] = useState(null); // Pet object being edited
    
    // NEW: Deletion Confirmation State
    const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

    // Simplified initial state (rely on useEffect for proper loading/reset)
    const [formData, setFormData] = useState({ 
        memberId: '', 
        groomerId: GROOMERS[0].id, 
        startTime: '10:00', 
        endTime: '11:00',
        note: ''
    });

    const [selectedPets, setSelectedPets] = useState([]);

    // Notification Preference State
    const [notificationPrefs, setNotificationPrefs] = useState({
        sms: true,
        line: true,
        calendar: false,
    });

    // --- FIX: Add useEffect to load/reset internal states when appointment prop changes ---
    useEffect(() => {
        if (appointment) {
            // A. Reset form data
            setFormData({ 
                memberId: appointment.memberId || '', 
                groomerId: appointment.groomerId || GROOMERS[0].id, 
                startTime: appointment.startTime || '10:00', 
                endTime: appointment.endTime || '11:00',
                note: appointment.note || ''
            });

            // B. Load/Reset pet and service data (using the improved logic)
            setSelectedPets(createPetEntries(appointment));
            
            // C. Load Notification Prefs (if present in the saved appointment)
            setNotificationPrefs(prev => ({
                 ...prev,
                 ...appointment.notificationPrefs,
            }));
        } else if (isOpen) {
             // Reset to defaults for a new appointment when opening
             setFormData({ 
                memberId: '', 
                groomerId: GROOMERS[0].id, 
                startTime: '10:00', 
                endTime: '11:00',
                note: ''
            });
            setSelectedPets([]);
            setIsDeleteConfirmVisible(false); // Reset confirmation state
        }
        
    }, [appointment, isOpen]);


    const selectedMember = useMemo(() => getMemberData(formData.memberId), [formData.memberId]);
    const memberPets = useMemo(() => getPetByOwner(formData.memberId), [formData.memberId]);

    // Handle Floating Client Info Visibility
    const handleScroll = () => {
        if (scrollRef.current) {
            setIsFloatingInfoVisible(scrollRef.current.scrollTop > 100);
        }
    };
    
    useEffect(() => {
         const scrollElement = scrollRef.current;
         if (scrollElement) {
            scrollElement.addEventListener('scroll', handleScroll);
            return () => scrollElement.removeEventListener('scroll', handleScroll);
        }
    }, []);


    // --- SERVICE CALCULATION AND FILTERING ---
    
    // 1. Get all selected items across all pets
    const allSelectedItems = useMemo(() => {
        return selectedPets.flatMap(petEntry => 
            petEntry.services.map(s => ({
                ...getItemDetails(s.id),
                pet: petEntry.petData, // Attach pet data to the item for display
                price: s.price, // Use price from saved entry (for potential future discounts/overrides)
                duration: s.duration,
            }))
        ).filter(item => item && item.id);
    }, [selectedPets]);
    
    // 2. Calculate totals
    const totalDuration = useMemo(() => {
        return allSelectedItems
            .filter(item => item.isService) 
            // FIX 2: Correct the syntax of the reduce callback function (sum, item) => ...
            .reduce((sum, item) => sum + (item.duration || 0), 0); 
    }, [allSelectedItems]);
    
    const totalServicePrice = useMemo(() => {
        // FIX 3: Correct the syntax of the reduce callback function to use (sum, item) => ...
        return allSelectedItems.reduce((sum, item) => sum + (item.price || 0), 0);
    }, [allSelectedItems]);
    
    // 3. Update End Time based on Duration
    
    useEffect(() => {
        if (formData.startTime) {
            setFormData(prev => ({ ...prev, endTime: addMinutes(prev.startTime, totalDuration || 60) }));
        } else {
             setFormData(prev => ({ ...prev, endTime: addMinutes('10:00', totalDuration || 60) })); 
        }
    }, [totalDuration, formData.startTime]);

    // --- ACTION HANDLERS ---
    
    // NEW: Handle Cancellation Flow
    const handleCancelAppointment = () => {
        if (appointment?.id) {
            setIsDeleteConfirmVisible(true);
        }
    };
    
    const handleConfirmDelete = () => {
        if (appointment?.id) {
            onDelete(appointment.id); // Calls the onDelete prop with the appointment ID
            // Parent component (GroomingModule) will close the modal and update the list.
        }
    }


    const discountRate = (selectedMember?.level === 'ก๊วนเพื่อนซี้') ? 0.10 : 0.0;
    const discountAmount = totalServicePrice * discountRate; // 10% mock discount for specific level
    const finalPrice = totalServicePrice - discountAmount;
    
    const handleAddPet = (pet) => {
        // Only add if not already in the list
        if (!selectedPets.some(p => p.petId === pet.id)) {
            setSelectedPets(prev => [...prev, { petId: pet.id, services: [], petData: pet }]);
        }
        setIsPetSelectModalOpen(false);
    };

    const handleRemovePet = (petId) => {
        setSelectedPets(prev => prev.filter(p => p.petId !== petId));
    };

    const handleOpenServiceModal = (petEntry) => {
        setPetForServiceModal(petEntry.petData); // Pass the raw pet object
        setIsServiceSelectModalOpen(true);
    };
    
    const handleSavePetServices = (petId, newServices) => {
        setSelectedPets(prev => prev.map(p => 
            p.petId === petId ? { ...p, services: newServices } : p
        ));
        setIsServiceSelectModalOpen(false);
        setPetForServiceModal(null);
    };

    const handleConfirmBooking = () => {
        if (!formData.memberId || allSelectedItems.length === 0) {
            // FIX: Replaced alert with console.error/log or better yet, a custom UI element if necessary. 
            // Since custom UI is complex for debugging, I'll log and prevent action.
            console.error("กรุณาเลือกรายการลูกค้าและบริการก่อน!");
            return;
        }
        
        // Ensure all selected services are assigned to at least one pet (if not a retail item)
        // NOTE: This check is handled implicitly by the multi-pet selection model,
        // but we add a general check.
        if (selectedPets.length === 0 && allSelectedItems.some(item => item.isService)) {
             console.error("กรุณาเลือกสัตว์เลี้ยงสำหรับบริการ Grooming/Spa ด้วย!");
             return;
        }
        
        setIsPromotionConfirmOpen(true);
    }
    
    const handleFinalSave = () => {
        // Prepare data for saving (Mocking the complex structure)
        const finalAppointmentData = {
            id: appointment?.id || `A${Date.now()}`,
            memberId: formData.memberId,
            groomerId: formData.groomerId,
            startTime: formData.startTime,
            endTime: formData.endTime,
            note: formData.note,
            // Use the new petsWithServices structure
            petsWithServices: selectedPets.map(p => ({
                petId: p.petId,
                serviceIds: p.services.map(s => s.id),
            })).filter(p => p.serviceIds.length > 0), // Filter out pets with no services
            price: finalPrice,
            totalDuration: totalDuration,
            notificationPrefs: notificationPrefs,
            status: appointment?.status || 'confirmed',
        };
        
        // Simulate saving
        onSave(finalAppointmentData);
        
        // Mock history update log (Requirement #5)
        console.log(`--- Mock Save Complete ---`);
        console.log(`[Database Action] Logged Appointment ${finalAppointmentData.id} for Member ${formData.memberId}`);
        finalAppointmentData.petsWithServices.forEach(entry => {
            console.log(`[Database Action] Updated history for Pet ${entry.petId} with services: ${entry.serviceIds.join(', ')}`);
        });
        console.log(`--------------------------`);

        setIsPromotionConfirmOpen(false);
        onClose();
    };

    const handleSelectMember = (memberId) => {
        setFormData(prev => ({ ...prev, memberId: memberId }));
        setSelectedPets([]); // Clear pets when changing member
        setIsMemberSearchOpen(false);
    }
    
    const handleNotificationToggle = (type) => {
        setNotificationPrefs(prev => ({
            ...prev,
            [type]: !prev[type],
        }));
    };


    // --- SUB-COMPONENTS ---
    
    const PetEntryCard = ({ petEntry, onAddServices, onRemove }) => {
        const pet = petEntry.petData;
        const serviceCount = petEntry.services.length;
        const totalPetPrice = petEntry.services.reduce((sum, s) => sum + s.price, 0);
        
        return (
            <div className="flex items-center p-4 rounded-xl border border-gray-200 bg-white shadow-sm hover:border-indigo-400 transition">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-indigo-200 flex-shrink-0 mr-4">
                    <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" onError={(e) => {e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/94a3b8/ffffff?text=PET';}}/>
                </div>
                
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 leading-tight">{pet.name} <span className="text-xs font-normal text-gray-500">({pet.breed})</span></p>
                    <p className="text-xs text-gray-500">
                        {pet.weight} kg | {WEIGHT_RANGES[getWeightRangeIndex(pet.weight)]}
                    </p>
                </div>
                
                <div className="flex items-center gap-3 ml-4">
                    <div className="text-right flex-shrink-0">
                         <p className="text-xs text-indigo-500 font-bold">{serviceCount} รายการ</p>
                         <p className="text-sm font-bold text-emerald-600">{totalPetPrice.toFixed(0)}{SYSTEM_DEFAULTS.currencySymbol}</p>
                    </div>
                    
                    <button 
                        onClick={() => onAddServices(petEntry)}
                        className={`p-2 rounded-full transition-all flex items-center justify-center text-white shadow-md ${serviceCount > 0 ? 'bg-teal-600 hover:bg-teal-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                        title={serviceCount > 0 ? 'แก้ไขบริการ' : 'เพิ่มบริการ'}
                    >
                        {serviceCount > 0 ? <Edit2 size={16}/> : <Plus size={16}/>}
                    </button>
                    
                    <button 
                        onClick={() => onRemove(pet.id)}
                        className="p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 transition"
                        title="ลบสัตว์เลี้ยงออกจากการนัดหมาย"
                    >
                        <Trash2 size={16}/>
                    </button>
                </div>
            </div>
        );
    };

    const OrderSummaryItem = ({ item }) => {
        const Icon = item.isService ? Scissors : ShoppingCart;
        const color = item.isService ? 'text-teal-600' : 'text-red-600';
        
        return (
            <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition border-b border-gray-100">
                <div className="flex items-center gap-3">
                    {/* Pet Image/Icon Indicator */}
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
                        <img src={item.pet.image} alt={item.pet.name} className="w-full h-full object-cover" onError={(e) => {e.target.onerror = null; e.target.src = 'https://placehold.co/80x80/94a3b8/ffffff?text=PET';}} />
                    </div>
                    <div className="min-w-0">
                         <p className="text-xs text-gray-500 font-medium leading-none mb-0.5">({item.pet.name}) - {item.category}</p>
                         <p className="font-bold text-gray-800 text-sm flex items-center gap-1">
                             <Icon size={14} className={color}/>
                             {item.name}
                         </p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="font-bold text-sm text-emerald-600">{item.price.toFixed(2)}{SYSTEM_DEFAULTS.currencySymbol}</span>
                </div>
            </div>
        );
    }


    return (
        <>
            <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
                <div className="bg-white w-full max-w-6xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95">
                     
                     {/* Header (Always visible) */}
                     <div className="p-6 border-b border-gray-100 bg-white rounded-t-2xl sticky top-0 z-20 shadow-sm flex justify-between items-center">
                        <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}>
                            <CalendarDays size={24} className="text-indigo-600"/>{appointment?.id ? 'แก้ไขนัดหมาย' : 'ลงนัดหมายใหม่'}
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-500"><X size={20} /></button>
                    </div>

                    {/* Floating Client/Pet Info Bar (Visible on scroll) */}
                    {selectedMember && (
                        <div 
                            className={`sticky top-16 z-10 p-3 bg-indigo-50/95 backdrop-blur-sm border-b border-indigo-200 shadow-lg transition-opacity duration-300 flex items-center gap-4 ${isFloatingInfoVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
                        >
                            <UserCheck size={20} className="text-indigo-600"/>
                            <p className="text-sm text-gray-700">ลูกค้า: <span className="font-bold">{selectedMember.name}</span> (<span className="text-indigo-600 font-medium">{selectedMember.phone}</span>)</p>
                            {selectedPets.length > 0 && (
                                <p className="text-sm text-gray-700 flex items-center gap-1 ml-4">
                                    <PawPrint size={16} className="text-green-600"/> สัตว์เลี้ยง ({selectedPets.length} ตัว): <span className="font-bold">{selectedPets.map(p => p.petData.name).join(', ')}</span>
                                </p>
                            )}
                        </div>
                    )}
                    
                    {/* MAIN CONTENT GRID (SCROLLABLE AREA) */}
                    <div ref={scrollRef} className="p-6 overflow-y-auto custom-scrollbar flex-1 grid grid-cols-12 gap-6">
                        
                        {/* LEFT COLUMN (COL 5): Client & Pet Management */}
                        <div className="col-span-12 lg:col-span-5 space-y-6 flex flex-col">
                            
                            {/* 1. Customer Selection */}
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3 sticky top-0 z-10">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2"><Users size={18} className="text-indigo-500"/> ข้อมูลลูกค้า</h3>
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">ลูกค้า</label>
                                    <button onClick={() => setIsMemberSearchOpen(true)} className="text-xs bg-indigo-50 text-indigo-600 font-bold px-3 py-1 rounded-full hover:bg-indigo-100 transition flex items-center gap-1">
                                        <Plus size={14}/> {selectedMember ? 'เปลี่ยนลูกค้า' : 'ค้นหาลูกค้า'}
                                    </button>
                                </div> 
                                <div className="p-3 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                    {selectedMember ? (
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-bold text-lg text-gray-900">{selectedMember.name}</p>
                                                <p className="text-sm text-gray-500">รหัสสมาชิก: <span className='font-bold text-indigo-500'>{selectedMember.id}</span></p>
                                            </div>
                                            <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedMember.levelColor}`}>{selectedMember.level}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-400 text-center py-2">--- กรุณาค้นหาลูกค้าก่อน ---</p>
                                    )}
                                </div>
                            </div>

                            {/* 2. Pet List and Service Assignment */}
                            <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col min-h-[250px]">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 flex items-center justify-between">
                                    <div className='flex items-center gap-2'><PawPrint size={18} className="text-green-500"/> สัตว์เลี้ยงที่เข้ารับบริการ ({selectedPets.length})</div>
                                    <button 
                                        onClick={() => { if(selectedMember) setIsPetSelectModalOpen(true); }}
                                        disabled={!selectedMember}
                                        className={`text-xs px-3 py-1 rounded-full font-bold transition flex items-center gap-1 ${!selectedMember ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'}`}
                                    >
                                        <Plus size={14}/> เลือกสัตว์เลี้ยง
                                    </button>
                                </h3>
                                
                                <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-1">
                                    {selectedPets.length > 0 ? (
                                        selectedPets.map((petEntry) => (
                                            <PetEntryCard 
                                                key={petEntry.petId} 
                                                petEntry={petEntry} 
                                                onAddServices={handleOpenServiceModal} 
                                                onRemove={handleRemovePet}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center p-6 text-gray-400">
                                            <Dog size={32} className="mx-auto mb-2 opacity-50"/>
                                            <p className="text-sm">เพิ่มสัตว์เลี้ยงเพื่อเริ่มเลือกบริการ</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN (COL 7): Order Summary */}
                        <div className="col-span-12 lg:col-span-7 space-y-6 flex flex-col">
                            
                            {/* 3. Order Summary Panel */}
                            <div className="space-y-4 flex-1 flex flex-col min-h-[400px] bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 flex items-center gap-2"><Receipt size={18} className="text-orange-500"/> สรุปรายการสั่งซื้อ ({allSelectedItems.length} รายการ)</h3>
                                
                                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1">
                                    {allSelectedItems.length > 0 ? (
                                        allSelectedItems.map((item, index) => (
                                            <OrderSummaryItem key={`${item.id}-${index}`} item={item} />
                                        ))
                                    ) : (
                                        <div className="text-center p-10 text-gray-400">
                                            <ShoppingCart size={32} className="mx-auto mb-3 opacity-50" />
                                            <p className="font-bold text-lg">ไม่มีรายการสั่งซื้อ/บริการ</p>
                                            <p className="text-sm">กรุณาเลือกสัตว์เลี้ยงและเพิ่มรายการบริการ</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* 4. Price Summary Box (Kept from old footer) */}
                            <div className="bg-indigo-50 p-4 rounded-xl shadow-md border border-indigo-200 space-y-2 mt-auto">
                                <h3 className="font-bold text-lg text-indigo-800 flex items-center gap-2"><Receipt size={18}/> สรุปค่าใช้จ่ายทั้งหมด</h3>
                                <div className="flex justify-between text-sm text-gray-700"><span>ราคารวมบริการ</span><span className="font-bold">{totalServicePrice.toFixed(2)} {SYSTEM_DEFAULTS.currencySymbol}</span></div>
                                <div className={`flex justify-between text-sm ${discountAmount > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                    <span>ส่วนลดโปรโมชั่น ({discountRate * 100}%)</span>
                                    <span>- {discountAmount.toFixed(2)} {SYSTEM_DEFAULTS.currencySymbol}</span>
                                </div>
                                <div className="flex justify-between text-xl text-indigo-700 font-extrabold pt-2 border-t border-indigo-100">
                                    <span>ยอดสุทธิ</span>
                                    <span>{finalPrice.toFixed(2)} {SYSTEM_DEFAULTS.currencySymbol}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* FIXED FOOTER / ACTION BAR (Combines Time, Groomer, Note, Notification, Save) */}
                    <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl sticky bottom-0 z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        
                        {/* Row 1: Time, Groomer, Note */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">ช่างตัดขน (Groomer)</label>
                                <select 
                                    value={formData.groomerId} 
                                    onChange={(e) => setFormData({...formData, groomerId: e.target.value})} 
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white focus:ring-indigo-500 transition text-sm"
                                >
                                    {GROOMERS.map(g => <option key={g.id} value={g.id}>{g.name} ({g.nickname})</option>)}
                                </select>
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-bold text-gray-700 mb-1">เวลาเริ่ม/สิ้นสุด ({totalDuration} min)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="time" 
                                        value={formData.startTime} 
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})} 
                                        className="w-full px-2 py-2 border border-gray-200 rounded-xl focus:ring-indigo-500 transition text-sm" 
                                    />
                                    <span className="text-gray-500">-</span>
                                    <input 
                                        type="time" 
                                        value={formData.endTime} 
                                        readOnly 
                                        className="w-full px-2 py-2 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 text-sm" 
                                    />
                                </div>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-1">หมายเหตุการนัด</label>
                                 <input 
                                    type="text" 
                                    value={formData.note} 
                                    onChange={(e) => setFormData({...formData, note: e.target.value})} 
                                    placeholder="เช่น แพ้ยา, ห้ามตัดขนที่หู, เน้นทรงเกาหลี"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-indigo-500 transition text-sm" 
                                />
                            </div>
                        </div>
                        
                        {/* Row 2: Notifications & Save Button (UPDATED) */}
                        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            
                            {/* Notification Preferences */}
                            <div className="flex flex-col gap-2">
                                <p className="text-sm font-bold text-gray-700">ช่องทางการแจ้งเตือน</p>
                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => handleNotificationToggle('sms')}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${notificationPrefs.sms ? 'bg-green-100 text-green-700 border-green-300 border' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        <Smartphone size={14} /> SMS
                                    </button>
                                    <button 
                                        onClick={() => handleNotificationToggle('line')}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${notificationPrefs.line ? 'bg-blue-100 text-blue-700 border-blue-300 border' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        <MessageCircle size={14} /> LINE
                                    </button>
                                    <button 
                                        onClick={() => handleNotificationToggle('calendar')}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${notificationPrefs.calendar ? 'bg-red-100 text-red-700 border-red-300 border' : 'bg-gray-100 text-gray-500'}`}
                                    >
                                        <Calendar size={14} /> Google Calendar
                                    </button>
                                </div>
                            </div>
                            
                            {/* Action Buttons Group (Cancel/Save) */}
                            <div className="flex items-center gap-3">
                                {/* Cancel Button (Visible only when editing) */}
                                {appointment?.id && (
                                    <button 
                                        onClick={handleCancelAppointment} 
                                        className="px-6 py-3 rounded-xl text-red-600 font-bold border border-red-300 bg-red-50 hover:bg-red-100 transition flex items-center gap-2 transform active:scale-95 text-sm shadow-sm"
                                    >
                                        <Trash2 size={18} /> ยกเลิกนัดหมาย
                                    </button>
                                )}
                            
                                {/* Save Button */}
                                <button 
                                    onClick={handleConfirmBooking} 
                                    className={`px-8 py-3 rounded-xl text-white font-bold shadow-lg transition flex items-center gap-2 transform active:scale-95 ${
                                        allSelectedItems.length === 0 
                                        ? 'bg-gray-400 cursor-not-allowed opacity-70' 
                                        : 'bg-indigo-600 shadow-indigo-200 hover:bg-indigo-700'
                                    }`}
                                    disabled={allSelectedItems.length === 0}
                                >
                                    <Check size={18} /> ยืนยัน & บันทึกนัดหมาย
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <MemberSearchModal 
                isOpen={isMemberSearchOpen} 
                onClose={() => setIsMemberSearchOpen(false)} 
                onSelectMember={handleSelectMember} 
                currentMemberId={formData.memberId}
            />
            
            <PetSelectionModal
                isOpen={isPetSelectModalOpen}
                onClose={() => setIsPetSelectModalOpen(false)}
                memberPets={memberPets}
                onSelectPet={handleAddPet}
                selectedPetIds={selectedPets.map(p => p.petId)}
            />

            <PetServiceSelectionModal
                isOpen={isServiceSelectModalOpen}
                onClose={() => setIsServiceSelectModalOpen(false)}
                pet={petForServiceModal}
                services={services}
                petServices={selectedPets.find(p => p.petId === petForServiceModal?.id)?.services || []}
                onSaveServices={handleSavePetServices}
            />

            <PromotionConfirmationModal 
                isOpen={isPromotionConfirmOpen} 
                onClose={() => setIsPromotionConfirmOpen(false)} 
                onConfirm={handleFinalSave}
                summary={{ totalServicePrice, discountAmount, finalPrice, serviceCount: allSelectedItems.length }}
            />
            
            {/* NEW: Deletion Confirmation Modal */}
            {isDeleteConfirmVisible && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsDeleteConfirmVisible(false)}></div>
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl relative z-10 flex flex-col transform scale-100 transition-transform duration-300 p-6 text-center">
                        <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                        <h3 className={`${FONTS.header} text-xl font-bold text-gray-800 mb-2`}>ยืนยันการยกเลิกนัดหมาย?</h3>
                        <p className="text-sm text-gray-600 mb-6">คุณแน่ใจหรือไม่ว่าต้องการยกเลิกนัดหมายนี้ การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsDeleteConfirmVisible(false)} className="px-6 py-2.5 rounded-xl text-gray-500 font-bold hover:bg-gray-100 transition">ยกเลิก</button>
                            <button onClick={handleConfirmDelete} className="px-8 py-2.5 rounded-xl bg-red-600 text-white font-bold shadow-lg shadow-red-200 hover:bg-red-700 transition flex items-center gap-2 transform active:scale-95">
                                <XCircle size={18} /> ยืนยันยกเลิกนัด
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const GroomingModule = ({ onNavigate, setIsDrawerOpen }) => {
    const [activePage, setActivePage] = useState('booking');
    const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS_DATA);
    const [services, setServices] = useState(ALL_SALES_ITEMS); // Updated to ALL_SALES_ITEMS
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [isQuickSetupOpen, setIsQuickSetup] = useState(false);
    const [selectedGroomer, setSelectedGroomer] = useState(null);
    const [editingAppointment, setEditingAppointment] = useState(null);
    
    // NEW STATES for Service Management
    const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
    const [editingService, setEditingService] = useState(null);

    // Mock States for Client Filtering AND VIEW MODE
    const [clientSearch, setClientSearch] = useState('');
    const [clientFilterLevel, setClientFilterLevel] = useState('all');
    const [viewMode, setViewMode] = useState('card'); // 'card' or 'list'
    
    const filteredClients = useMemo(() => {
        let clients = INITIAL_MEMBERS_DB.filter(m => m.id !== '000'); // Exclude general customer
        
        // Search Filter
        if (clientSearch) {
            const lowerCaseSearch = clientSearch.toLowerCase();
            clients = clients.filter(c => 
                c.name.toLowerCase().includes(lowerCaseSearch) || 
                c.phone.replace(/-/g, '').includes(lowerCaseSearch.replace(/-/g, ''))
            );
        }
        
        // Level Filter
        if (clientFilterLevel !== 'all') {
            clients = clients.filter(c => c.level === clientFilterLevel);
        }
        
        // Sort by visits descending (Mock)
        clients.sort((a, b) => b.visits - a.visits);
        
        return clients;
    }, [clientSearch, clientFilterLevel]);


    const handleOpenBooking = (initialData = null) => { setEditingAppointment(initialData); setIsBookingModalOpen(true); };
    
    const handleSaveAppointment = (appData) => { 
        // --- START FIX: Adapt new multi-pet structure for old calendar display ---
        // Extract info for the primary pet (or first one) for the calendar card display
        const primaryPetEntry = appData.petsWithServices?.[0];
        const calendarApp = {
            ...appData, // Keep all new data
            // Add legacy fields expected by AppointmentCard (for simple fallback display, though calendarSlots handles it now)
            petId: primaryPetEntry?.petId, 
            serviceIds: primaryPetEntry?.serviceIds || [],
        };
        // --- END FIX ---
        
        if (editingAppointment && editingAppointment.id) { 
            // Correctly update the existing appointment by ID
            setAppointments(prev => prev.map(a => a.id === appData.id ? calendarApp : a)); 
        } else { 
            setAppointments(prev => [...prev, calendarApp]); // Use the adapted calendarApp
        }
        setIsBookingModalOpen(false);
    };
    
    // NEW: Handle Deletion
    const handleDeleteAppointment = (appId) => {
        setAppointments(prev => prev.filter(a => a.id !== appId));
        setIsBookingModalOpen(false); // Close modal after deletion
        console.log(`Appointment ${appId} successfully deleted.`);
    };
    
    // Handler for saving individual service (from ServiceModal)
    const handleSaveService = (serviceData) => {
        setServices(prev => {
            if (serviceData.id && prev.some(s => s.id === serviceData.id)) {
                // Edit existing
                return prev.map(s => s.id === serviceData.id ? serviceData : s);
            } else {
                // Add new
                const newService = {
                    ...serviceData,
                    id: `S${Date.now()}` // Generate unique ID for new service
                };
                return [...prev, newService];
            }
        });
        setIsServiceModalOpen(false);
    };
    
    // Handler for saving services from QuickSetup (existing handler, renamed for clarity)
    const handleSaveServicesFromQuickSetup = (newServices) => { 
        setServices(prev => { 
            const serviceMap = new Map(prev.map(s => [s.id, s])); 
            newServices.forEach(s => serviceMap.set(s.id, s)); 
            return Array.from(serviceMap.values()); 
        }); 
        console.log(`บันทึกเรียบร้อย: สร้าง/อัปเดต ${newServices.length} รายการ`); 
    };

    const handleOpenServiceModal = (service = null) => {
        setEditingService(service);
        setIsServiceModalOpen(true);
    };


    const renderContent = () => {
        if (activePage === 'booking') return <BookingCalendar appointments={appointments} setAppointments={setAppointments} onOpenModal={handleOpenBooking} />;
        if (activePage === 'staff') {
            if (selectedGroomer) return <GroomerDetail groomer={selectedGroomer} onBack={() => setSelectedGroomer(null)} />;
            return (
                <div className="p-8 h-full bg-gray-50 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}><UserCheck size={24}/> ทีมช่างผู้เชี่ยวชาญ</h2>
                        <div className="flex items-center gap-3">
                            <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white">
                                <option>Sort by: Rating (คะแนน)</option>
                                <option>Sort by: Speed (ความเร็ว)</option>
                                <option>Sort by: Care (ความใส่ใจ)</option>
                            </select>
                            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-indigo-200">
                                <Filter size={16} /> Filter
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto custom-scrollbar flex-1 pb-4">
                         {GROOMERS.map(g => (
                            <GroomerSelectionCard key={g.id} groomer={g} onClick={setSelectedGroomer} />
                         ))}
                         <button className="border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-500 transition min-h-[200px]"><Plus size={32} /><span className="font-bold mt-2">Add New Groomer</span></button>
                    </div>
                </div>
            );
        }
        
        // --- UPDATED SERVICES MODULE ---
        if (activePage === 'services') return (
            <div className="p-8 h-full bg-gray-50 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800`}>Services & Pricing</h2>
                    <div className="flex gap-3">
                         <button onClick={() => handleOpenServiceModal()} className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-teal-200">
                            <Plus size={16} /> เพิ่มรายการใหม่
                        </button>
                        <button onClick={() => setIsQuickSetup(true)} className="bg-white text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl font-bold hover:bg-indigo-50 flex items-center gap-2 shadow-sm">
                            <Zap size={18} className="fill-indigo-600" /> Quick Setup Matrix
                        </button>
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex-1 flex flex-col">
                    <div className="overflow-y-auto flex-1 custom-scrollbar min-h-0">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                                <tr>
                                    <th className="p-4 text-left font-bold text-gray-600 min-w-[300px]">Service Name</th>
                                    <th className="p-4 text-left font-bold text-gray-600">Type</th>
                                    <th className="p-4 text-left font-bold text-gray-600">Category</th>
                                    <th className="p-4 text-left font-bold text-gray-600">Duration (min)</th>
                                    <th className="p-4 text-center font-bold text-gray-600">Weight Range</th>
                                    <th className="p-4 text-right font-bold text-gray-600">Price ({SYSTEM_DEFAULTS.currencySymbol})</th>
                                    <th className="p-4 text-center font-bold text-gray-600">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {services.map(s => {
                                    // Determine the icon and its color based on service status
                                    let IconComponent;
                                    let iconColor;
                                    
                                    if (s.isService) {
                                        IconComponent = s.category === 'Spa' ? HeartPulse : Scissors;
                                        // Use color from service category map (if available, fallback to indigo/teal)
                                        const category = SERVICE_CATEGORIES.find(c => c.id === s.filterType || c.id === s.type);
                                        iconColor = category ? `text-${category.color}-500` : 'text-teal-500';
                                    } else {
                                        // Products: Food is green, Retail is red/orange. Use ShoppingCart as general icon.
                                        IconComponent = ShoppingCart;
                                        iconColor = s.type === 'food' ? 'text-green-500' : 'text-red-500';
                                    }
                                    
                                    const weightLabel = s.weightRangeIdx !== -1 ? WEIGHT_RANGES[s.weightRangeIdx] : 'ALL';
                                    
                                    // Base color mapping for the type badge
                                    const typeColorClass = s.isService ? `bg-teal-50 text-teal-600` : (s.type === 'food' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600');

                                    return (
                                        <tr key={s.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-bold text-gray-800 flex items-center gap-2">
                                                <IconComponent size={18} className={iconColor} />
                                                {s.name}
                                                {s.isQuickSetup && <span className="ml-2 text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded border border-yellow-200">AUTO</span>}
                                            </td>
                                            <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold uppercase ${typeColorClass}`}>{s.isService ? s.type : 'Product'}</span></td>
                                            <td className="p-4 text-gray-600">{s.category}</td>
                                            <td className="p-4 text-gray-500">{s.duration}</td>
                                            <td className="p-4 text-center text-gray-600 text-sm font-medium">{weightLabel}</td>
                                            <td className="p-4 text-right font-bold text-emerald-600">{s.price.toFixed(2)}</td>
                                            <td className="p-4 text-center text-gray-400">
                                                 <button onClick={() => handleOpenServiceModal(s)} className="p-1 hover:text-teal-600 transition" title="Edit Service">
                                                     <Edit2 size={18} />
                                                 </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
        // --- END UPDATED SERVICES MODULE ---
        
        if (activePage === 'clients') return (
            <div className="p-8 h-full bg-gray-50 flex flex-col">
                {/* Header & Controls */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10">
                    <h2 className={`${FONTS.header} text-2xl font-bold text-gray-800 flex items-center gap-2`}>
                        <Users size={24} className="text-sky-600"/> ประวัติลูกค้า ({INITIAL_MEMBERS_DB.length - 1} คน)
                    </h2>
                    
                    <div className="flex flex-wrap gap-4 mt-4 md:mt-0 items-center">
                        {/* Search Bar */}
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="ค้นหาชื่อ/เบอร์โทร..." 
                                value={clientSearch}
                                onChange={(e) => setClientSearch(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-sky-200 font-medium transition" 
                            />
                        </div>

                        {/* Filter by Level */}
                        <select 
                            value={clientFilterLevel} 
                            onChange={(e) => setClientFilterLevel(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium bg-white w-full md:w-auto focus:ring-2 focus:ring-sky-200"
                        >
                            <option value="all">ระดับสมาชิกทั้งหมด</option>
                            <option value="ครอบครัวขนฟู">ครอบครัวขนฟู</option>
                            <option value="ก๊วนเพื่อนซี้">ก๊วนเพื่อนซี้</option>
                            <option value="คู่หูขนฟู">คู่หูขนฟู</option>
                            <option value="ผู้พิทักษ์">ผู้พิทักษ์</option>
                        </select>
                        
                        {/* NEW: View Mode Toggle */}
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button 
                                onClick={() => setViewMode('card')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${viewMode === 'card' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                title="Card View"
                            >
                                <Grid size={16} /> Card
                            </button>
                            <button 
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition flex items-center gap-2 ${viewMode === 'list' ? 'bg-white shadow text-indigo-600' : 'text-gray-500 hover:bg-gray-200'}`}
                                title="List View"
                            >
                                <List size={16} /> List
                            </button>
                        </div>

                        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm shadow-lg shadow-emerald-200 w-full md:w-auto">
                            <Plus size={16} /> ลูกค้าใหม่
                        </button>
                    </div>
                </div>

                {/* Client Content Grid/List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredClients.length > 0 ? (
                        viewMode === 'card' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredClients.map(client => (
                                    <ClientCard 
                                        key={client.id} 
                                        client={client} 
                                        onViewDetails={(id) => console.log(`Viewing details for client ID: ${id}`)} 
                                    />
                                ))}
                            </div>
                        ) : (
                            <ClientList 
                                clients={filteredClients} 
                                onViewDetails={(id) => console.log(`Viewing details for client ID: ${id}`)} 
                            />
                        )
                    ) : (
                        <div className="text-center p-10 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
                            <AlertCircle size={32} className="mx-auto mb-3" />
                            <p className="font-bold text-lg">ไม่พบข้อมูลลูกค้า</p>
                            <p className="text-sm">ลองปรับการค้นหาหรือเพิ่มลูกค้าใหม่</p>
                        </div>
                    )}
                </div>
            </div>
        );
        
        return <div className="p-10 text-center text-gray-400">Page under construction: {activePage}</div>;
    };

    return (
        <div className="h-screen w-full bg-[#F3F4F6] flex overflow-hidden">
            <GroomingSidebar 
                onOpenDrawer={() => setIsDrawerOpen(true)} 
                onNavigate={onNavigate} 
                activePage={activePage} 
                onChangePage={(id) => { setSelectedGroomer(null); setActivePage(id); }} 
            />
            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 z-10 shadow-sm">
                    <div className="flex items-center gap-4">
                        {/* The menu button for mobile is now redundant if BaseSidebarLayout is always visible, but we keep it here for standard header UX/drawer access */}
                        <button onClick={() => setIsDrawerOpen(true)} className="p-2 -ml-2 hover:bg-gray-100 rounded-lg lg:hidden">
                            <Menu size={24} className="text-gray-600" />
                        </button>
                        <h1 className={`${FONTS.header} text-xl font-bold text-gray-800 capitalize`}>{activePage === 'booking' ? 'ตารางนัดหมาย' : activePage}</h1>
                    </div>
                    <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border-2 border-white shadow-sm">A</div></div>
                </header>
                <div className="flex-1 overflow-hidden relative">{renderContent()}</div>
            </div>
            <AppointmentModal 
                isOpen={isBookingModalOpen} 
                onClose={() => setIsBookingModalOpen(false)} 
                appointment={editingAppointment} 
                onSave={handleSaveAppointment} 
                onDelete={handleDeleteAppointment} // Pass the new delete handler
                services={services} 
            />
            {/* FIX: Corrected onClose prop from setIsQuickSetupOpen to setIsQuickSetup */}
            <QuickSetupModal 
                isOpen={isQuickSetupOpen} 
                onClose={() => setIsQuickSetup(false)} 
                onConfirm={handleSaveServicesFromQuickSetup} 
            />
            <ServiceModal 
                isOpen={isServiceModalOpen}
                onClose={() => setIsServiceModalOpen(false)}
                onSave={handleSaveService}
                service={editingService}
            />
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
  const [settings, setSettings] = useState(INITIAL_SETTINGS); // ✅ ใช้ INITIAL_SETTINGS ใหม่
  const [homeModules, setHomeModules] = useState(INITIAL_HOME_MODULES); // ✅ เพิ่ม State Home Module
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
  const [currentTheme, setCurrentTheme] = useState(APP_THEMES.luxury);
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
// --- CART Logic ---
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

// =====PURCHASING ===PO LOGIC====
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
            // ✅ เรียกใช้ HomeScreen ใหม่
            return <HomeScreen modules={homeModules} onNavigate={handleNavigate} onReorderModules={setHomeModules} />;

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
		
		case 'promo': 
    return <PromotionModule onNavigate={handleNavigate} onOpenDrawer={() => setIsDrawerOpen(true)} />;
		
		case 'expenses':
            return (
                <ExpenseModule 
                    onNavigate={handleNavigate} 
                    onOpenDrawer={() => setIsDrawerOpen(true)} 
                />
            );
			
		case 'settings': 
            return <SettingsModule 
                        onNavigate={handleNavigate} 
                        onOpenDrawer={() => setIsDrawerOpen(true)} 
                        currentTheme={currentTheme} 
                        onChangeTheme={setCurrentTheme} 
                   />;
		default:
            const modules = {
              dashboard: { title: 'Dashboard Analytics', icon: LayoutDashboard },
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
          className="fixed bottom-6 right-6 bg-[#1E1E24] hover:bg-gray-800 text-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.3)] z-50 transition-all duration-300 border-2 border-[#FCD34D] hover:scale-110 active:scale-95 group flex items-center gap-2 overflow-hidden"
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
