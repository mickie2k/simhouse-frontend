export type Product = {
	SimID: number;
	SimListName: string;
	PricePerHour: number;
	ListDescription: string;
	HostID: number;
	ModID: number;
	ModelName: string;
	Description: string;
	BrandID: number;
	BrandName: string;
	FName: string;
	LName: string;
	AddressDetail : string;
	Lat: number;
	Long: number;
	Htel : string;
};

export type Schedule = {
	ScheduleID: number;
	Price: number;
	Date: string;
	StartTime: string;
	EndTime: string;
	Available: number;
	SimID: number;
};
export type Booking = {
	BookingID: number;
	BookingDate: string;
	TotalPrice: number;
	StatusID: number;
	CustomerID: number;
	SimID: number;
	Statusname: string;
};
export type BookingDetailSchedule = {
	BookingID: number;
	BookingDate: string;
	TotalPrice: number;
	StatusID: number;
	CustomerID: number;
	SimID: number;
	ScheduleID: number;
	Price: number;
	Date: string;
	StartTime: string;
	EndTime: string;
	SimListName: string;
	PricePerHour: number;
	HostID: number;
	FName: string;
	AddressDetail: string;
	Lat: number;
	Long: number;
	HTel: string;
};