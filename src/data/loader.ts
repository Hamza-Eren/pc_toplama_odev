export async function loadData(category: string) {
    const res = await fetch(`/data/${category}.json`);
    return res.json();
}