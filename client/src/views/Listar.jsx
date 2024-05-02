
import MUIDataTable from "mui-datatables";
import SubMenu from "../components/SubMenu";
const Listar = () => {
    const columns = [
        {
         name: "Name",
         options: {
          filter: true,
          sort: false
         }
        },
        {
            name: "Apellido",
        },
        {
            name: "Edad",
            options: {
                filter: true,
                sort: true,
                sortDirection: 'desc',
            },
        },
        {
            name: "Nacionalidad",
        },

       ];

    const data = [
        ["Miguel", "Carrillo", 26, "Venezolano"],
        ["Pedro", "Perez", 30, "py"],
        ["Juan", "Benitrez", 10, "arg"],

    ];
    const options = {
        filterType: 'checkbox',
      };
  return (
    <>
     <SubMenu>
     <MUIDataTable 
        title={"Employee List"}
        data={data}
        columns={columns}
        options={options}
        searchable={true}
        />

     </SubMenu>
        
    </>
  )
}

export default Listar