import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const FloatingDock = ({ 
  items = [], 
  desktopClassName, 
  mobileClassName,
  defaultBgColor = "bg-neutral-800",
  defaultHoverColor = "bg-neutral-700"
}) => {
  if (!items || items.length === 0) return null;

  const handleItemClick = (e, item) => {
    e.preventDefault();
    if (item.onClick) {
      item.onClick();
    }
  };

  const mouseX = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={`
        z-50 
        inline-flex h-16 items-end 
        rounded-2xl backdrop-blur-sm 
        shadow-lg
        w-fit text-center
        gap-2 px-2 pb-3 pt-2
        xl:gap-4 xl:px-3
        ${mobileClassName || ''} 
        ${desktopClassName || ''}
      `}
    >
      <p className='pb-1 hidden xl:block'>Host Controls :</p>
      <p className='pb-1 xl:hidden'>Controls:</p>
      {items.map((item) => (
        <IconContainer 
          mouseX={mouseX} 
          key={item.title} 
          {...item} 
          defaultBgColor={defaultBgColor}
          defaultHoverColor={defaultHoverColor}
          onItemClick={handleItemClick}
        />
      ))}
    </motion.div>
  );
};

const IconContainer = ({ 
  mouseX, 
  title, 
  icon, 
  href,
  bgColor,
  hoverColor,
  iconColor,
  defaultBgColor,
  defaultHoverColor,
  onItemClick,
  ...item
}) => {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Different size transformations for mobile and desktop
  const widthTransform = useTransform(distance, [-150, 0, 150], [32, 48, 32]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [32, 48, 32]);
  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [16, 24, 16]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [16, 24, 16]);

  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  return (
    <a 
      href={href}
      onClick={(e) => onItemClick(e, { title, href, icon, ...item })}
    >
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`
          aspect-square rounded-full 
          ${bgColor || defaultBgColor} 
          hover:${hoverColor || defaultHoverColor} 
          flex items-center justify-center relative
          xl:scale-125
        `}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="
                px-2 py-0.5 whitespace-pre rounded-md 
                bg-neutral-800 border border-neutral-700 
                text-neutral-200 absolute left-1/2 
                -translate-x-1/2 -top-8 w-fit 
                text-[10px] xl:text-xs
              "
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className={`flex items-center justify-center ${iconColor || 'text-neutral-200'}`}
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
};

export default FloatingDock;