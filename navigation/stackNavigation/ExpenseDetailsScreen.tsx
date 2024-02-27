// HomeScreen.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Circle } from 'react-native-svg';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { ExpenseItem } from '../../src/data';
import { useFocusEffect } from '@react-navigation/native';

type HomeProps = {
    navigation: any;
    onLogout: () => void;
};

const MAX_LIMIT = 5000;

const MAX_SPENDING_LIMIT = 30000;

const MAX_CATEGORY_SPENDING_LIMIT = 5000;



const ExpenseDetails: React.FC<HomeProps> = ({ navigation, onLogout }) => {

    const [currentDate, setCurrentDate] = useState(new Date());

    const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
    const [totalSpending, setTotalSpending] = useState<number>(0);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedCategoryColor, setSelectedCategoryColor] = useState<string | null>(null);
    const [selectedCategorySpending, setSelectedCategorySpending] = useState<number>(0);

    const totalFillPercentage = ((totalSpending / MAX_SPENDING_LIMIT) * 100).toFixed(2);

    const totalCategoryPercentage = ((selectedCategorySpending / MAX_CATEGORY_SPENDING_LIMIT) * 100).toFixed(2)


    // useEffect(() => {
    //     fetchExpensesAndTotalSpending();
    // }, []);

    useFocusEffect(
        useCallback(() => {
            const fetchExpensesAndTotalSpending = async () => {
                try {
                    const expensesJson = await AsyncStorage.getItem('expenses');
                    const totalSpendingStr = await AsyncStorage.getItem('totalSpending');
                    if (expensesJson !== null && totalSpendingStr !== null) {
                        const expensesData: ExpenseItem[] = JSON.parse(expensesJson);
                        const totalSpendingData: number = parseFloat(totalSpendingStr);
                        setExpenses(expensesData);
                        setTotalSpending(totalSpendingData);
                    }
                } catch (error) {
                    console.error('Error fetching data from AsyncStorage:', error);
                }
            };

            fetchExpensesAndTotalSpending();
        }, [])
    );

    const isCurrentMonth = () => {
        const currentMonth = new Date().getMonth();
        const selectedMonth = currentDate.getMonth();
        return currentMonth === selectedMonth;
    };

    const fetchExpensesAndTotalSpending = async () => {
        try {
            const expensesJson = await AsyncStorage.getItem('expenses');
            const totalSpendingStr = await AsyncStorage.getItem('totalSpending');
            if (expensesJson !== null && totalSpendingStr !== null) {
                const expensesData: ExpenseItem[] = JSON.parse(expensesJson);
                const totalSpendingData: number = parseFloat(totalSpendingStr);
                setExpenses(expensesData);
                setTotalSpending(totalSpendingData);
            }
        } catch (error) {
            console.error('Error fetching data from AsyncStorage:', error);
        }
    };


    const navigateToAnotherScreen = () => {
        navigation.navigate('AddExpense');
    };

    const decrementMonth = () => {
        setCurrentDate((prevDate) => {
            const prevMonth = prevDate.getMonth();
            const prevYear = prevDate.getFullYear();
            const newDate = new Date(prevYear, prevMonth - 1);
            return newDate;
        });
    };

    const incrementMonth = () => {
        setCurrentDate((prevDate) => {
            const prevMonth = prevDate.getMonth();
            const prevYear = prevDate.getFullYear();
            const newDate = new Date(prevYear, prevMonth + 1);
            return newDate;
        });
    };

    const getFormattedMonthYear = () => {
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        return `${month} ${year}`;
    };

    const handleCategoryPress = (item: ExpenseItem) => {
        if (selectedCategory === item.category) {
            setSelectedCategory(null);
            setSelectedCategorySpending(0);
            setSelectedCategoryColor("#35c937")
        } else {
            setSelectedCategory(item.category);
            const categorySpending = expenses.reduce((acc, expense) => {
                if (expense.category === item.category) {
                    acc += expense.sliderValue;
                }
                return acc;
            }, 0);
            setSelectedCategorySpending(categorySpending);
            setSelectedCategoryColor(item.color)
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerTitle}>Spending Dashboard</Text>
                <TouchableOpacity onPress={onLogout}>
                    <Text style={styles.headerTitle}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.cardContainer}>
                <View style={styles.headerContainer}>
                    <Text style={styles.cardTitle}>Spending Summary</Text>
                    <TouchableOpacity onPress={navigateToAnotherScreen} style={styles.editContainer}>
                        <Text style={styles.editText}>Edit</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.calenderContainer}>
                    <TouchableOpacity onPress={decrementMonth} style={styles.iconContainer}>
                        <FontAwesomeIcon
                            icon={faAngleLeft}
                            size={16}
                            color="#000000"
                        />
                    </TouchableOpacity>
                    <View style={styles.editContainer}>
                        <Text style={styles.editText}>{getFormattedMonthYear()}</Text>
                    </View>
                    <TouchableOpacity onPress={incrementMonth} style={styles.iconContainer}>
                        <FontAwesomeIcon
                            icon={faAngleRight}
                            size={16}
                            color="#000000"
                        />
                    </TouchableOpacity>
                </View>
                <View style={{ alignItems: 'center', marginTop: 30 }}>
                    <AnimatedCircularProgress
                        size={300}
                        width={15}
                        fill={selectedCategory ? (selectedCategorySpending / MAX_LIMIT) * 100 : (isCurrentMonth() ? totalFillPercentage : 0)}
                        tintColor={selectedCategory ? (selectedCategoryColor || '#35c937') : (isCurrentMonth() ? "#35c937" : "#000")}
                        arcSweepAngle={180}
                        rotation={270}
                        lineCap='round'
                        padding={20}
                        renderCap={({ center }) => <Circle cx={center.x} cy={center.y} r="8" fill="#fff" />}
                        backgroundColor="#f1f0f5">
                        {
                            (fill) => (
                                <View style={styles.fillContainer}>
                                    <View style={styles.fillPercentContainer}>
                                        <Text style={styles.percentText}>
                                            {selectedCategory ? (totalCategoryPercentage || 0) : (isCurrentMonth() ? fill : 0)}
                                        </Text>
                                        <Text style={styles.percentText}>
                                            %
                                        </Text>
                                    </View>
                                    <Text style={styles.totalPercentText}>Total spendings</Text>
                                </View>
                            )
                        }
                    </AnimatedCircularProgress>
                </View>
                <View style={styles.metricsContainer}>
                    <View>
                        <Text style={styles.metricsLabel}>Amount spent</Text>
                        <Text style={styles.metricsValue}>AED {selectedCategory ? (selectedCategorySpending || 0) : (isCurrentMonth() ? totalSpending : 0.00)}</Text>
                    </View>
                    <View>
                        <Text style={styles.metricsLabel}>Spending limit</Text>
                        <Text style={styles.metricsValue}>AED {selectedCategory ? (MAX_CATEGORY_SPENDING_LIMIT || 0) : (isCurrentMonth() ? MAX_SPENDING_LIMIT : 0.00)}</Text>
                    </View>
                </View>
                {
                    (isCurrentMonth() && expenses.length > 0 && totalSpending !== null) ? (
                        <FlatList
                            data={expenses}
                            renderItem={({ item }) => {
                                const fillPercentage = (item.sliderValue / MAX_LIMIT) * 100;
                                return (
                                    <TouchableOpacity onPress={() => handleCategoryPress(item)} style={[
                                        styles.item,
                                        { borderColor: selectedCategory === item.category ? item.color : 'transparent', borderWidth: selectedCategory === item.category ? 0.5 : 0, borderRadius: 20 }
                                    ]}>
                                        <AnimatedCircularProgress
                                            size={50}
                                            width={3}
                                            fill={fillPercentage}
                                            tintColor={item.color}
                                            backgroundColor="#f1f0f5">
                                            {
                                                () => (
                                                    <Image source={item.image} style={{ width: 20, height: 20 }} />
                                                )
                                            }
                                        </AnimatedCircularProgress>
                                        <Text style={{ color: item.color }}>{item.category}</Text>
                                    </TouchableOpacity>
                                )
                            }}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3}
                            contentContainerStyle={{ justifyContent: 'space-between' }}
                        />
                    ) : (
                        <View style={styles.noDataContainer}>
                            <Image source={require('../../assets/NO_DATA.png')} style={styles.noDataImg} />
                            <View style={styles.noDataContainer}>
                                <Text style={styles.noDataText}>No data found</Text>
                                <Text style={styles.noDataSubText} numberOfLines={2}>
                                    It seems like you didn't set spending limits{'\n'}
                                    for this month.
                                </Text>
                            </View>
                        </View>
                    )
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f0f5'
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20
    },
    headerTitle: {
        color: '#000',
        fontSize: 18,
        fontWeight: '500'
    },
    cardContainer: {
        width: '90%',
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 20
    },
    cardTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    editContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#000000',
    },
    editText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500'
    },
    calenderContainer: {
        marginLeft: 20,
        marginRight: 20,
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    iconContainer: {
        width: 28,
        height: 28,
        backgroundColor: '#f1f0f5',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center'
    },
    calenderText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500'
    },
    fillContainer: {
        height: 60,
        justifyContent: 'space-evenly'
    },
    fillPercentContainer: {
        marginTop: -80,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    percentText: {
        color: '#000',
        fontSize: 28,
        fontWeight: '500'
    },
    totalPercentText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '500',
        marginTop: -20
    },
    metricsContainer: {
        marginTop: -150,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    metricsLabel: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500'
    },
    metricsValue: {
        color: '#000',
        fontSize: 16,
        fontWeight: 'bold'
    },
    item: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        height: 100,
    },
    noDataImg: {
        width: 60,
        height: 60
    },
    noDataContainer: {
        alignItems: 'center',
        marginTop: 15
    },
    noDataText: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold'
    },
    noDataSubText: {
        color: '#53545d',
        textAlign: 'center',
        fontSize: 20,
        fontWeight: '300',
        margin: 10
    }
});

export default ExpenseDetails;
