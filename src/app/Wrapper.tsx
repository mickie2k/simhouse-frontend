export default function Wrapper({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<div>
			<h1>MyWrapper</h1>
			<div>{children}</div>
		</div>
	);
}
