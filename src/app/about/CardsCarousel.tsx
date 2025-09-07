import React, { useState } from 'react';
import Image from 'next/image';
import Card from './Card';
import styles from './about.module.css';
import './about.module.css';
import Slider from 'react-slick';

interface CardsCarouselProps {
  cards: {
    title: string;
    description: string;
    imageUrls: string[];
  }[];
}
function MyPrevArrow({className, style, onClick}){

    return (
        <div className={className} style={{...style, position:"absolute", left:'-25px',top:"50%",display:'block'}} onClick={onClick}></div>
    )
}
function MyNextArrow({className,style,onClick}){
    return (
        <Image className={className} style={{...style, position:"absolute", right:'-50px',top:"50%",display:'block'}} onClick={onClick} src="/right-red-arrow.png" alt="error finding right red arrow" width="20" height="20"/>
    )
}
const CardsCarousel: React.FC<CardsCarouselProps> = ({ cards }) => {
  const [showAll, setShowAll] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % cards.length);
  };

  const goToPreviousCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
  };
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows:true,
    prevArrow:<MyPrevArrow />,
    nextArrow:<MyNextArrow/>
  };
  return (
    <div>
      <button onClick={toggleShowAll}>
        {showAll ? 'Show Carousel' : 'Show All Cards'}
      </button>
      {showAll ? (
        // Display all cards stacked vertically
        cards.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            description={card.description}
            imageUrls={card.imageUrls}
          />
        ))
) : (
        // Display single card in carousel
        <div className={styles.singleCardCarouselContainer}>
            <Slider {...settings}>
            {cards.map((card, index) => (
                <Card
                    key={index}
                    title={card.title}
                    description={card.description}
                    imageUrls={card.imageUrls}
                />
            ))}
            </Slider>
    </div>
        
      )}
    </div>
  );
};

export default CardsCarousel;
