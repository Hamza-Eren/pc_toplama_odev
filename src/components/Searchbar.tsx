export default function Searchbar({ filters, setFilters }: any) {
    return (
        <div>
            <input
                placeholder="Ürün ara..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
        </div>
    );
}