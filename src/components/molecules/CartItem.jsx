import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity } = item;

  const handleIncrement = () => {
    onUpdateQuantity(product.Id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.Id, quantity - 1);
    }
  };

  const handleRemove = () => {
    onRemove(product.Id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-center gap-4 p-4 bg-white rounded-lg border border-slate-200"
    >
      <img
src={product.image_c}
        alt={product.title_c}
        className="w-16 h-16 object-cover rounded-lg"
      />

      <div className="flex-1 min-w-0">
<h4 className="font-medium text-slate-800 truncate">{product.title_c}</h4>
        <p className="text-sm text-slate-600 truncate">{product.category_c}</p>
<p className="font-semibold text-accent">${product.price_c.toFixed(2)}</p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="p-1 w-8 h-8"
        >
          <ApperIcon name="Minus" size={14} />
        </Button>

        <span className="w-8 text-center font-medium">{quantity}</span>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleIncrement}
          className="p-1 w-8 h-8"
        >
          <ApperIcon name="Plus" size={14} />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRemove}
          className="p-1 w-8 h-8 text-red-500 hover:text-red-600 hover:bg-red-50 ml-2"
        >
          <ApperIcon name="Trash2" size={14} />
        </Button>
      </div>
    </motion.div>
  );
};

export default CartItem;