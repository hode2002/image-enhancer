import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import moment from 'moment';

interface ErrorMetadata {
    error?: {
        message: string;
        stack: string;
    };
    [key: string]: any;
}

const requestFormat = winston.format.printf(
    ({ level, message, timestamp, context, ...metadata }) => {
        const time = moment(timestamp as any).format('YYYY-MM-DD HH:mm:ss');
        const contextStr = context ? `[${context}]` : '[App]';
        const metadataStr = Object.keys(metadata).length ? JSON.stringify(metadata) : '';
        return `[${time}] ${contextStr} ${level.toUpperCase()}: ${message} ${metadataStr}`;
    },
);

const errorFormat = winston.format.printf(
    ({
        level,
        message,
        timestamp,
        context,
        ...metadata
    }: winston.Logform.TransformableInfo & { metadata?: ErrorMetadata }) => {
        const time = moment(timestamp as any).format('YYYY-MM-DD HH:mm:ss');
        const contextStr = context ? `[${context}]` : '[App]';
        const errorDetails =
            metadata?.error && typeof metadata.error === 'object' && metadata.error !== null
                ? `\nError: ${(metadata.error as Error).message}\nStack: ${(metadata.error as Error).stack}`
                : '';
        return `[${time}] ${contextStr} ${level.toUpperCase()}: ${message}${errorDetails}`;
    },
);

export const winstonLogger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.ms(),
        winston.format.errors({ stack: true }),
        winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'context'] }),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ all: true }),
                winston.format.timestamp(),
                winston.format.ms(),
                winston.format.errors({ stack: true }),
                winston.format.metadata({
                    fillExcept: ['message', 'level', 'timestamp', 'context'],
                }),
                winston.format.printf(({ level, message, timestamp, context, ...metadata }) => {
                    const time = moment(timestamp as any).format('YYYY-MM-DD HH:mm:ss');
                    const contextStr = context ? `[${context}]` : '[App]';
                    return `${time} ${contextStr} ${level}: ${message}`;
                }),
            ),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.metadata({
                    fillExcept: ['message', 'level', 'timestamp', 'context'],
                }),
                errorFormat,
            ),
        }),
        new winston.transports.File({
            filename: 'logs/combined.log',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.errors({ stack: true }),
                winston.format.metadata({
                    fillExcept: ['message', 'level', 'timestamp', 'context'],
                }),
                requestFormat,
            ),
        }),
    ],
});

export const winstonLoggerConfig = WinstonModule.createLogger({
    instance: winstonLogger,
});
