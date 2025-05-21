import { Divider } from "antd";
import { Languages } from "lucide-react";
import AntTable from "@components/AntTable";
import InputForm from "@components/InputForm";

const MainLayout = () => {
  return (
    <div className="p-5 min-h-screen">
      <div className="grid grid-cols-12 gap-y-5">
        <header className="col-span-12 flex justify-center">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-x-2">
            <Languages className="text-primary" size={30} />
            <span>Language Translator</span>
            <Languages className="text-primary" size={30} />
          </h1>
        </header>
        <div className="col-span-12">
          <section className="bg-blue-50 shadow-sm rounded-lg flex flex-col min-h-[calc(100vh-95px)]">
            <div className="p-5 flex-1">
              <div className="space-y-5">
                <InputForm />
                <Divider />
                <AntTable />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
