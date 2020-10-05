import React from 'react';

interface Props {
  inventory: any []
};

const Articles: React.FunctionComponent<Props> = ({inventory}) => {
  const getArticleItems = () => (
		inventory.map((article, i) => (
			<div className="item flex" key={i}>
				<div>{article.art_id}</div>
				<div className="growing">{article.name}</div>
				<div>In stock: {article.stock}</div>
			</div>
		))
  );
  
  return (
    <div className="list">
			<div className="text-headline">Articles in warehouse</div>
			{getArticleItems()}
		</div>
  );
};

export default Articles;