type Props = {
    data: any[];
    category: string;
    onSelect: (item: any) => void;
    selected?: any;
};

export default function Table({ data, category, onSelect, selected }: Props) {
    return (
        <div>
            <h3>{category.toUpperCase()}</h3>
            <table>
                <thead>
                <tr>
                    <th>Ad</th>
                    <th>Marka</th>
                    <th>Fiyat</th>
                </tr>
                </thead>
                <tbody>
                {data.map((item) => {
                    const stokDisi = item.stok?.durum === "out_of_stock";
                    return (
                        <tr
                            key={item.id}
                            onClick={() => !stokDisi && onSelect(item)}
                            style={{
                                background: selected?.id === item.id ? "#ddd" : stokDisi ? "#f0f0f0" : "white",
                                color: stokDisi ? "#999" : "black",
                                cursor: stokDisi ? "not-allowed" : "pointer",
                            }}
                            title={stokDisi ? "Stokta yok" : ""}
                        >
                            <td>{item.ad}</td>
                            <td>{item.marka}</td>
                            <td>{item.fiyat_try} ₺</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
