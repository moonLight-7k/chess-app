import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants/theme';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error: Error): State {
        return {
            hasError: true,
            error,
            errorInfo: null,
        };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
        this.setState({
            error,
            errorInfo,
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <View style={styles.container}>
                    <View style={styles.content}>
                        <Icon name="alert-circle-outline" size={80} color={COLORS.error} />
                        <Text style={styles.title}>Oops! Something went wrong</Text>
                        <Text style={styles.message}>
                            We're sorry for the inconvenience. The app encountered an unexpected error.
                        </Text>

                        {__DEV__ && this.state.error && (
                            <View style={styles.errorDetails}>
                                <Text style={styles.errorTitle}>Error Details:</Text>
                                <Text style={styles.errorText}>{this.state.error.toString()}</Text>
                                {this.state.errorInfo && (
                                    <Text style={styles.errorText}>
                                        {this.state.errorInfo.componentStack}
                                    </Text>
                                )}
                            </View>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.handleReset}
                            accessible={true}
                            accessibilityLabel="Try again"
                            accessibilityRole="button"
                        >
                            <Text style={styles.buttonText}>Try Again</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
    },
    content: {
        alignItems: 'center',
        maxWidth: 400,
    },
    title: {
        fontSize: FONT_SIZES.xxl,
        fontFamily: 'Orbitron-Bold',
        color: COLORS.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    message: {
        fontSize: FONT_SIZES.md,
        fontFamily: 'Orbitron-Regular',
        color: COLORS.textSecondary,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 24,
    },
    errorDetails: {
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        padding: SPACING.md,
        borderRadius: 8,
        marginBottom: SPACING.lg,
        maxWidth: '100%',
    },
    errorTitle: {
        fontSize: FONT_SIZES.sm,
        fontFamily: 'Orbitron-Bold',
        color: COLORS.error,
        marginBottom: SPACING.sm,
    },
    errorText: {
        fontSize: FONT_SIZES.xs,
        fontFamily: 'Orbitron-Regular',
        color: COLORS.error,
        lineHeight: 18,
    },
    button: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.xl,
        borderRadius: 12,
        elevation: 3,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonText: {
        fontSize: FONT_SIZES.lg,
        fontFamily: 'Orbitron-Bold',
        color: COLORS.background,
        textAlign: 'center',
    },
});

export default ErrorBoundary;
