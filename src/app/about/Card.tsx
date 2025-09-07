import React from 'react';
import * as Collapsible from '@radix-ui/react-collapsible';
import Image from 'next/image';
import styles from './about.module.css';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import dynamic from 'next/dynamic';

interface CardProps {
  title: string;
  description: string;
  imageUrls: string[];
}

const Card: React.FC<CardProps> = ({ title, description, imageUrls }) => {
  const [open, setOpen] = React.useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };

  const DynamicSlider = dynamic(() => import('react-slick').then(mod => mod.default), {ssr: false});

  return (
    <div className={styles.card}>
      <h3>{title}</h3>
      <p>{description}</p>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger className={styles.CollapsibleTrigger}>
          See Images
        </Collapsible.Trigger>
        <Collapsible.Content className={styles.CollapsibleContent}>
          <DynamicSlider {...settings}>
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className={styles.carouselItem}>
                <Image
                  src={imageUrl}
                  alt={`Image ${index + 1}`}
                  width={300}
                  height={200}
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
          </DynamicSlider>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
};

export default Card;