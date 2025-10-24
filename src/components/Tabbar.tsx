import { tabs, requiredTabs } from "@/data/tabs";

type Props = {
    category: string;
    setCategory: (cat: string) => void;
};

export default function Tabbar({ category, setCategory }: Props) {
    return (
        <div>
            {tabs.map((t) => {
                const isRequired = requiredTabs.includes(t);
                return (
                    <button
                        key={t}
                        onClick={() => setCategory(t)}
                        style={{
                            background: t === category ? "#ccc" : "#eee",
                            margin: "2px",
                            padding: "5px",
                        }}
                    >
                        {t.toUpperCase()}
                        {isRequired ? "*" : ""}
                    </button>
                );
            })}
        </div>
    );
}