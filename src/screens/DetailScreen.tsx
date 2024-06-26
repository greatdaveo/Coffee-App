import React, {useState} from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useStore} from '../store/store';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import ImageBackgroundInfo from '../components/detals/ImageBackgroundInfo';
import PaymentFooter from '../components/footer/PaymentFooter';

const DetailScreen = ({navigation, route}: any) => {
  //   console.log('route = ', route.params);
  const itemOfIndex = useStore((state: any) =>
    route.params.type == 'Coffee' ? state.CoffeeList : state.BeanList,
  )[route.params.index];

  const [fullDesc, setFullDesc] = useState(false);
  const [price, setPrice] = useState(itemOfIndex.prices[0]);

  //   To return to the home page
  const BackHandler = () => {
    navigation.pop();
  };

  // To Add To Favorite
  const addToFavoriteList = useStore((state: any) => state.addToFavoriteList);
  // To Add To Cart
  const addToCart = useStore((state: any) => state.addToCart);
  // To Calculate Cart Price
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const deleteFromFavoriteList = useStore(
    (state: any) => state.deleteFromFavoriteList,
  );

  const ToggleFavorite = (favorite: boolean, type: string, id: string) => {
    favorite ? deleteFromFavoriteList(type, id) : addToFavoriteList(type, id);
  };

  const addToCartHandler = ({
    id,
    index,
    name,
    type,
    roasted,
    special_ingredient,
    imagelink_square,
    price,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      type,
      roasted,
      special_ingredient,
      imagelink_square,
      prices: [{...price, quantity: 1}],
    });
    calculateCartPrice();
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewFlex}>
        <ImageBackgroundInfo
          EnableBackHandler={true}
          imageLink_portrait={itemOfIndex.imagelink_portrait}
          type={itemOfIndex.type}
          id={itemOfIndex.id}
          favorite={itemOfIndex.favourite}
          name={itemOfIndex.name}
          special_ingredient={itemOfIndex.special_ingredient}
          ingredients={itemOfIndex.ingredients}
          average_rating={itemOfIndex.average_rating}
          ratings_count={itemOfIndex.ratings_count}
          roasted={itemOfIndex.roasted}
          BackHandler={BackHandler}
          ToggleFavorite={ToggleFavorite}
        />

        <View style={styles.footerInfoArea}>
          <Text style={styles.footerInfoTitle}>Description</Text>
          {fullDesc ? (
            <TouchableWithoutFeedback
              onPress={() => setFullDesc(prev => !prev)}>
              <Text style={styles.footerDescriptionText}>
                {itemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          ) : (
            <TouchableWithoutFeedback
              onPress={() => setFullDesc(prev => !prev)}>
              <Text numberOfLines={3} style={styles.footerDescriptionText}>
                {itemOfIndex.description}
              </Text>
            </TouchableWithoutFeedback>
          )}

          <>
            <Text style={styles.footerInfoTitle}>Size</Text>

            <View style={styles.sizeOuterContainer}>
              {itemOfIndex.prices.map((data: any) => (
                <TouchableOpacity
                  key={data.size}
                  onPress={() => {
                    setPrice(data);
                  }}
                  style={[
                    styles.sizeBox,
                    {
                      borderColor:
                        data.size == price.size
                          ? COLORS.primaryOrangeHex
                          : COLORS.primaryDarkGreyHex,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.sizeText,
                      {
                        fontSize:
                          itemOfIndex.type == 'bean'
                            ? FONTSIZE.size_14
                            : FONTSIZE.size_16,
                        color:
                          data.size == price.size
                            ? COLORS.primaryOrangeHex
                            : COLORS.primaryLightGreyHex,
                      },
                    ]}>
                    {data.size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        </View>

        <>
          <PaymentFooter
            price={price}
            buttonTitle="Add to Cart"
            buttonPressHandler={() => {
              addToCartHandler({
                id: itemOfIndex.id,
                index: itemOfIndex.index,
                name: itemOfIndex.index,
                type: itemOfIndex.type,
                roasted: itemOfIndex.roasted,
                imagelink_square: itemOfIndex.imagelink_square,
                special_ingredient: itemOfIndex.special_ingredient,
                price: itemOfIndex.price,
              });
            }}
          />
        </>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    // color:
  },

  scrollViewFlex: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  footerInfoArea: {
    padding: SPACING.space_20,
  },

  footerInfoTitle: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_10,
  },

  footerDescriptionText: {
    letterSpacing: 0.5,
    fontFamily: FONTFAMILY.poppins_regular,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
    marginBottom: SPACING.space_30,
  },

  sizeOuterContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.space_20,
  },

  sizeBox: {
    flex: 1,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
    justifyContent: 'center',
    height: SPACING.space_24 * 2,
    borderRadius: BORDERRADIUS.radius_10,
    borderWidth: 2,
  },

  sizeText: {
    fontFamily: FONTFAMILY.poppins_medium,
  },
});
export default DetailScreen;
