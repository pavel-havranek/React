import React, { useState, useRef } from "react";
import { PageContainer, EmployeeList, EmployeeItem, EmployeeForm, Buttons, TabButton, KillTheEmployee, AddWorkButton } from "./homeStyles";
import { employees } from "./employeesData";
import { isEqual } from "lodash";

export default function Home() {
	const employeesCount = useRef(employees.length);
	const [listOfEmployees, setListOfEmployees] = useState(employees);
	const [activeTab, setActiveTab] = useState('list-of-employees');
	const [workStorage, setWorkStorage] = useState({
		metry: 0,
		čas: 0,
	});
	const [tempWorkStorage, setTempWorkStorage] = useState({
		metry: "",
		čas: "",
	});
	

	const [addEmployee, setAddEmployee] = useState({
		id: (employeesCount.current + 1),
		name: "",
		sex: "",
	});
	const handleChange = (e) => {
		setAddEmployee({...addEmployee, [e.target.name]: e.target.value});
	};
	const handleAdd = async (e) => {
		e.preventDefault();
		let pushEmployee = true;
		// let totalRequirements = {
		// 	metry: (employeeRequirements.metry * (listOfEmployees.length + 1)),
		// 	čas: (employeeRequirements.čas * (listOfEmployees.length + 1)),
		// };
		// if (
		// 	totalRequirements.metry <= workStorage.metry &&
		// 	totalRequirements.čas <= workStorage.čas
		// ) {
		// 	pushEmployee = true;
		// }
		
		if (pushEmployee) {
			await setListOfEmployees((listOfEmployees) => {
				return [...listOfEmployees, addEmployee];
			});
			employeesCount.current++;
			await setAddEmployee({
				id: (employeesCount.current + 1),
				name: "",
				sex: "",
			});
		} else {
			console.warn('Malo zásob pro tolik psů.');
		}
		pushEmployee = false;
	};
	const handleDelete = (id) => {
		setListOfEmployees(listOfEmployees.filter( employee => employee.id != id));
	};
	const handleWork = (e) => {
		setTempWorkStorage({ ...tempWorkStorage, [e.target.name]: e.target.value});
	};
	let pushWork = false;
	const checkWork = (e) => {		
		let workCapacity = 0;
	for(let i = 0; i < listOfEmployees.length; i++){
		if(listOfEmployees[i].sex == "muž"){
			workCapacity = workCapacity + 1
		}
		else{
			workCapacity = workCapacity + 0.5
		}		
	};
	
	console.log(workCapacity);
	if((workCapacity >= ((workStorage.metry+tempWorkStorage.metry) / (workStorage.čas+tempWorkStorage.čas)))) {
		pushWork = true;
		console.log("ano");
		document.getElementById("xk").disabled = false;
		document.getElementById("xk").style =  "background-color: green "
		
		
	}
	else{
		pushWork = false;
		document.getElementById("xk").disabled = true;
		document.getElementById("xk").style =  "background-color: red"
		
		
	};

	console.log(pushWork)
	}
	const updateWork = async (e) => {	
		if(pushWork==true){
		e.preventDefault();				
		const workValue = tempWorkStorage;
		let newStorageValue = {};
		// workValue = {metry: "", čas: ""}
		const keys = Object.keys(workValue);
		// keys = ['metry', 'čas']
		// key = keys[1]
		keys.map((key) => {
			// workValue.čas
			if (parseInt(workValue[key])) {
				newStorageValue[key] = parseInt(workStorage[key]) + parseInt(workValue[key]);
			} else {
				newStorageValue[key] = parseInt(workStorage[key]);
			}
		})
		await setWorkStorage(newStorageValue);
		await setTempWorkStorage({ metry: "", čas: "" });
		}	
	};

	const switchTab = (e, newValue) => {
		e.preventDefault();
		const newActiveTab = newValue;
		setActiveTab(newActiveTab);
		
	};
	// useEffect(() => {
	// 	setPushEmployee(false);
	// }, [listOfEmployees])

	return (
		<PageContainer>
			<Buttons>
				<TabButton name="list-of-employees" activeTab={activeTab} onClick={(event) => { switchTab(event, 'list-of-employees') }}>
					Seznam Zaměstnanců
				</TabButton>
				<TabButton name="work-storage" activeTab={activeTab} onClick={(event) => { switchTab(event, 'work-storage') }}>
					 Seznam práce
				</TabButton>
			</Buttons>
			{ (activeTab === 'list-of-employees') && 
				<>
					<EmployeeList name="EmployeeList">
						{
								listOfEmployees.map((employee) => (
									<EmployeeItem key={employee.id} name={employee.name}>
										{employee.name} / {employee.sex}
										
										<KillTheEmployee
											onClick={() => {handleDelete(employee.id)}}
										>
											x
										</KillTheEmployee>
									</EmployeeItem>
								))
						}
					</EmployeeList>
					<EmployeeForm name="EmployeeForm">
						<input
							type="text"
							placeholder="jméno"
							className="inputClass"
							name="name"
							value={addEmployee.name}
							onChange={handleChange}
						/>
						<input
							type="text"
							placeholder="pohlaví"
							className="inputClass"
							name="sex"
							value={addEmployee.sex}
							onChange={handleChange}
						/>
						<button
							className="inputClass"
							onClick={handleAdd}
						>
							Přidat
						</button>
					</EmployeeForm>
				</>
			}
			{ (activeTab === 'work-storage') &&
				<>
					<EmployeeForm style={{ flexDirection: 'column '}}>
						<div
							className="inputClass"
							style={{color: 'white', height: 'auto'}}
						>
							<b>Aktuální práce</b>
							<p>
								Metry: {workStorage.metry},
								Čas: {workStorage.čas}
							</p>
						</div>
						
						<input
							type="number"
							placeholder="metry"
							className="inputClass"
							name="metry"
							value={tempWorkStorage.metry}
							onChange={handleWork}
						/>
						<input
							type="number"
							placeholder="čas na práci"
							className="inputClass"
							name="čas"
							value={tempWorkStorage.čas}
							onChange={handleWork}
						/>
						<button
							className="inputClass"
							onClick={checkWork}
						>
							Kontrola
						</button>
						<button
							
							id="xk"
							className="inputClass"
							onClick={updateWork}
													
						>
							Naplánovat
							</button>
					</EmployeeForm>					
				</>
			}
		</PageContainer>
	);
}
