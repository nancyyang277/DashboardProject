import UserInfo from "@/components/UserInfo";
import ItemsTable from "@/components/itemsTable";
import ItemService from "@/services/items";

const HomePage = async () => {
    let res;
    try {
        res = await ItemService.getAll();
        if (!res) throw new Error("Failed to fetch items");
    } catch (error) {
        console.error("Error fetching items:", error);
    } 

    return (
        <div>
            <UserInfo />
            <ItemsTable data={res}/>
        </div>
    );
};

export default HomePage;

