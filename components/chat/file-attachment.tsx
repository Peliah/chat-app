// components/chat/file-attachment.tsx
import { colors, spacing } from '@/lib/constants/colors';
import { FileIcon } from 'lucide-react-native';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { DocumentIcon } from '@/components/ui/icons';

interface FileAttachmentProps {
    attachment: {
        id: string;
        url: string;
        type: 'image' | 'document';
        name?: string;
    };
}

export function FileAttachment({ attachment }: FileAttachmentProps) {
    const handlePress = () => {
        // Handle file opening logic here
        console.log('Opening attachment:', attachment);
    };

    return (
        <TouchableOpacity onPress={handlePress} style={styles.container}>
            {attachment.type === 'image' ? (
                <Image source={{ uri: attachment.url }} style={styles.image} />
            ) : (
                <View style={styles.documentContainer}>
                    <FileIcon size={24} color={colors.text.primary} />
                    <Text style={styles.documentName} numberOfLines={1}>
                        {attachment.name}
                    </Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.sm,
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    documentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 4,
        padding: spacing.sm,
        maxWidth: 200,
    },
    documentName: {
        marginLeft: spacing.sm,
        color: colors.text.primary,
        flexShrink: 1,
    },
});