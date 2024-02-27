import { View, Text, TouchableOpacity, StyleSheet, Image, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import Slider from '@react-native-community/slider';
import data from '../../src/data';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface ExpenseItem {
    id: number;
    category: string;
    price: number;
    image: any;
    color: any;
    sliderValue: number;
}

const ListItem: React.FC<{ item: ExpenseItem; sliderChangeHandler: (itemId: number, value: number) => void }> = ({ item, sliderChangeHandler }) => (
    <View style={{ padding: 10, }}>
        <View style={styles.listItemContainer}>
            <View style={styles.listItemHeaderContainer}>
                <View style={styles.listItemTitleContainer}>
                    <Image source={item.image} style={styles.listItemIcon} />
                    <Text style={[styles.listItemText, { marginLeft: 5 }]}>{item.category}</Text>
                </View>
                <View style={styles.listItemTitleContainer}>
                    <Text style={styles.listItemText}>AED {item.sliderValue}</Text>
                    <Image source={require("../../assets/EDIT.png")} style={[styles.listItemIcon, { marginLeft: 5 }]} />
                </View>
            </View>
            <Slider
                style={{ width: 350, marginTop: 20 }}
                minimumValue={0}
                maximumValue={5000}
                minimumTrackTintColor={item.color}
                maximumTrackTintColor="#000000"
                accessibilityIncrements={["1000", "2000", "3000", "4000"]}
                lowerLimit={0}
                upperLimit={5000}
                thumbTintColor={item.color}
                step={1000}
                value={item.sliderValue}
                onValueChange={(value) => sliderChangeHandler(item.id, value)}
            />
            <View style={styles.metricContainer}>
                <Text style={styles.metricValues}>0</Text>
                <Text style={styles.metricValues}>5000</Text>
            </View>
        </View>
    </View>
)
const AddExpense: React.FC = () => {

    const [expenses, setExpenses] = useState<ExpenseItem[]>(data);
    const [totalSpending, setTotalSpending] = useState<number>(0);

    const navigation = useNavigation();

    useEffect(() => {
        // Fetch data from AsyncStorage during initialization
        fetchExpensesFromStorage();
        fetchTotalSpendingFromStorage();
    }, []);

    useEffect(() => {
        const total = expenses.reduce((acc, curr) => acc + curr.sliderValue, 0);
        setTotalSpending(total);
        updateExpensesInStorage(expenses);
    }, [expenses]);

    useEffect(() => {
        // Update AsyncStorage when total spending changes
        updateTotalSpendingInStorage(totalSpending);
    }, [totalSpending]);

    const fetchExpensesFromStorage = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('expenses');
            if (jsonValue !== null) {
                setExpenses(JSON.parse(jsonValue));
            } else {
                setExpenses(data); // Set default data if AsyncStorage is empty
            }
        } catch (error) {
            console.error('Error fetching expenses from AsyncStorage:', error);
        }
    };

    const fetchTotalSpendingFromStorage = async () => {
        try {
            const value = await AsyncStorage.getItem('totalSpending');
            if (value !== null) {
                setTotalSpending(parseFloat(value));
            }
        } catch (error) {
            console.error('Error fetching total spending from AsyncStorage:', error);
        }
    };

    const updateExpensesInStorage = async (updatedExpenses: ExpenseItem[]) => {
        try {
            await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));
        } catch (error) {
            console.error('Error updating expenses in AsyncStorage:', error);
        }
    };

    const updateTotalSpendingInStorage = async (updatedTotalSpending: number) => {
        try {
            await AsyncStorage.setItem('totalSpending', updatedTotalSpending.toString());
        } catch (error) {
            console.error('Error updating total spending in AsyncStorage:', error);
        }
    };

    const handleSliderChange = (itemId: number, value: number) => {
        setExpenses(prevExpenses =>
            prevExpenses.map((expense, index) =>
                expense.id === itemId ? { ...expense, sliderValue: value, color: getColorByIndex(index) } : expense
            )
        );
    };

    const getColorByIndex = (index: number): string => {
        const colors = ['#dabb4f', '#5ACCD1', '#ee9e38', '#76a6d3', '#dfa1a7', '#5281AC'];
        return colors[index % colors.length];
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.navigate('Home')}>
                    <FontAwesomeIcon
                        icon={faAngleLeft}
                        size={24}
                        color="#000000"
                    />
                </TouchableOpacity>
                <View style={{ margin: 20 }}>
                    <Text style={styles.headerTitle}>Total Spending Limit</Text>
                    <Text style={styles.totalAmountText}>AED {totalSpending}</Text>
                </View>
            </View>
            <FlatList
                data={expenses}
                renderItem={({ item }) => <ListItem item={item} sliderChangeHandler={handleSliderChange} />}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f0f5'
    },
    headerContainer: {
        padding: 10,
        height: '15%',
        backgroundColor: '#fff',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20
    },
    backIconContainer: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerTitle: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500'
    },
    totalAmountText: {
        color: '#000',
        fontSize: 28,
        fontWeight: 'bold'
    },
    listItemContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10
    },
    listItemHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    listItemTitleContainer: {
        flexDirection: 'row'
    },
    listItemIcon: {
        width: 20,
        height: 20
    },
    listItemText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    metricContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    metricValues: {
        color: '#adadb2',
        fontSize: 16,
        fontWeight: '500',
        marginLeft: 5
    }
})

export default AddExpense