const ProductCard = () => {
	return (
		<div className="flex flex-col max-w-72 h-96 border">
			<div className="h-72 w-full bg-slate-600"></div>
			<div className="flex flex-col grow justify-between">
				<div className="">
					<h3>Fanatec</h3>
					<p>Bangkok, TH</p>
				</div>
				<div className="">
					<h4>$100/hrs</h4>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
