"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Searchbar from "../components/Searchbar";
import Total from "../components/Total";
import Table from "../components/Table";
import Tabbar from "../components/Tabbar";
import { loadData } from "@/data/loader";
import { tabs } from "@/data/tabs";

export default function Home() {
    const [category, setCategory] = useState("anakart");
    const [data, setData] = useState<any[]>([]);
    const [selected, setSelected] = useState<Record<string, any>>({});
    const [filters, setFilters] = useState({ brand: "", search: "", minPrice: "", maxPrice: "" });

    useEffect(() => {
        const saved = localStorage.getItem("selectedParts");
        if (saved) setSelected(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("selectedParts", JSON.stringify(selected));
    }, [selected]);

    useEffect(() => {
        loadData(category).then(setData);
    }, [category]);

    // Filtreleme kısmını GPT yaptı.
    const filtered = data.filter((item) => {
        const brandOk = filters.brand ? item.marka?.toLowerCase().includes(filters.brand.toLowerCase()) : true;
        const searchOk = filters.search ? item.ad?.toLowerCase().includes(filters.search.toLowerCase()) : true;

        const raw = item.fiyat_try ?? item.fiyat ?? 0;
        const fiyat = Number(raw);
        const price = isNaN(fiyat) ? 0 : fiyat;

        const minOk = filters.minPrice !== "" ? price >= Number(filters.minPrice) : true;
        const maxOk = filters.maxPrice !== "" ? price <= Number(filters.maxPrice) : true;

        // === 3.1 Anakart ↔ İşlemci ===
        if (category === "islemci" && selected.anakart) {
            const a = selected.anakart;
            if (
                item.vendor !== a.cpu_uyumluluk?.vendor ||
                item.soket !== a.cpu_uyumluluk?.socket ||
                !a.cpu_uyumluluk?.nesiller?.includes(item.nesil)
            ) return false;
        }

        // === 3.2 Anakart ↔ RAM ===
        if (category === "ram" && selected.anakart) {
            const a = selected.anakart;
            if (
                item.tip !== a.bellek?.tip ||
                item.hiz_mhz > Math.max(...(a.bellek?.hiz_mhz || [])) ||
                item.modul_sayisi > a.bellek?.yuva_sayisi
            ) return false;
        }

        // === 3.3 Anakart ↔ Ekran Kartı (GPU) ===
        if (category === "ekran_karti" && selected.anakart) {
            const a = selected.anakart;
            if (a.genisleme?.pcie_x16 < 1) return false;
        }

        // === 3.4 Kasa ↔ Anakart ===
        if (category === "kasa" && selected.anakart) {
            const a = selected.anakart;
            if (!item.mobo_destek?.includes(a.form_factor)) return false;
        }

        // === 3.5 Kasa ↔ GPU ===
        if (category === "kasa" && selected.ekran_karti) {
            const g = selected.ekran_karti;
            if (g.boyut?.uzunluk_mm > item.gpu_uzunluk_max_mm) return false;
        }

        // === 3.6 PSU ↔ GPU (+ sistem wattı) ===
        if (category === "psu" && (selected.islemci || selected.ekran_karti)) {
            const cpuTdp = selected.islemci?.tdp_w || 0;
            const gpuTgp = selected.ekran_karti?.guc?.tgp_w || 0;
            const toplamWatt = cpuTdp + gpuTgp + 150;
            if (item.guc_w < toplamWatt) return false;
        }

        // === 3.7 PSU ↔ Kasa ===
        if (category === "psu" && selected.kasa) {
            const k = selected.kasa;
            if (k.psu_tumlesik === true) return false;
            if (!k.psu_destek?.includes(item.form_factor)) return false;
        }

        // === 3.8 CPU Soğutucu ↔ CPU ↔ Kasa ===
        if (category === "islemci_sogutucu" && (selected.islemci || selected.kasa)) {
            const cpu = selected.islemci;
            const kasa = selected.kasa;
            if (cpu && !item.desteklenen_soketler?.includes(cpu.soket)) return false;
            if (cpu && cpu.tdp_w > item.max_tdp_w) return false;
            if (kasa && item.yukseklik_mm > kasa.cpu_sogutucu_yukseklik_max_mm) return false;
        }

        // === 3.9 Depolama ↔ Anakart ===
        if (category === "depolama" && selected.anakart) {
            const a = selected.anakart;
            const arayuzTip = item.arayuz?.tip || "";
            if (arayuzTip.includes("SATA") && a.depolama?.sata <= 0) return false;
            if (arayuzTip.includes("NVMe") && a.depolama?.m2 <= 0) return false;
        }

        return brandOk && searchOk && minOk && maxOk;
    });

    const handleSelect = (item: any) => {
        if (item.stok?.durum === "out_of_stock") return;
        setSelected({ ...selected, [category]: item });

        const currentIndex = tabs.indexOf(category);
        if (currentIndex >= 0 && currentIndex < tabs.length - 1) {
            setCategory(tabs[currentIndex + 1]);
        }
    };

    return (
        <div className="parent">
            <div className="sidebar">
                <Sidebar filters={filters} setFilters={setFilters} />
            </div>
            <div className="searchbar">
                <Searchbar filters={filters} setFilters={setFilters} />
            </div>
            <div className="total">
                <Total selected={selected} setSelected={setSelected} />
            </div>
            <div className="table">
                <Table data={filtered} category={category} onSelect={handleSelect} selected={selected[category]} />
            </div>
            <div className="tabbar">
                <Tabbar category={category} setCategory={setCategory} />
            </div>
        </div>
    );
}
